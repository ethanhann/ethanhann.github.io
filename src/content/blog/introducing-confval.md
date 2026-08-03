---
title: Introducing confval
date: 2026-08-03
description: A Rust crate that reports every configuration problem, with a line and column for each, before a reload hot swaps the runtime config.
ogImage: ../../assets/blog/introducing_confval/confval_og_image.png
ogImageAlt: confval logo
---

A service is running.
You edit its configuration file and tell it to reload.
The reload reports success.
The next request kills the process.

```text
handled a request on 127.0.0.1:8443 at level info
reload accepted

thread 'main' panicked at src/main.rs:59:53:
log level: "unknown log level: infp"
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

The edit was a typo.
`level = "infp"` should have been `level = "info"`.
The reload accepted it because `level` is a `String` and `"infp"` is a `String`.
The code that turns that string into a log level runs on the request path.
That is where the problem was found.

A second bad value went in with the same edit.
`hostname` is now the empty string.
No error has been reported for it.

[confval](https://github.com/ethanhann/confval) is a Rust crate I wrote so that a reload is a decision you can make with confidence.
Everything that can reject a configuration runs before the swap.
After the swap, nothing is left in the configuration that can fail.

## The Configuration and the Reload

Here is the file the service is reading.

```toml
hostname = "127.0.0.1"
port = 8443

[logging]
level = "info"
enabled = true
```

Here is the reload path most Rust services start with.
The current configuration is behind a lock.
A reload deserializes the new text, then replaces what the lock holds.

```rust
use serde::Deserialize;
use std::str::FromStr;
use std::sync::{Arc, RwLock};

#[derive(Debug, Deserialize)]
pub struct Config {
    pub hostname: String,
    pub port: u16,
    pub logging: LoggingConfig,
}

#[derive(Debug, Deserialize)]
pub struct LoggingConfig {
    pub level: String,
    pub enabled: bool,
}

#[derive(Debug)]
pub enum Level {
    Error,
    Warn,
    Info,
    Debug,
}

impl FromStr for Level {
    type Err = String;

    fn from_str(text: &str) -> Result<Self, Self::Err> {
        match text {
            "error" => Ok(Level::Error),
            "warn" => Ok(Level::Warn),
            "info" => Ok(Level::Info),
            "debug" => Ok(Level::Debug),
            other => Err(format!("unknown log level: {other}")),
        }
    }
}

impl std::fmt::Display for Level {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let text = match self {
            Level::Error => "error",
            Level::Warn => "warn",
            Level::Info => "info",
            Level::Debug => "debug",
        };
        f.write_str(text)
    }
}

pub fn reload(current: &RwLock<Arc<Config>>, text: &str) -> Result<(), Box<dyn std::error::Error>> {
    let next: Config = toml::from_str(text)?;
    *current.write().unwrap() = Arc::new(next);
    Ok(())
}

fn handle_request(config: &Config) {
    let level: Level = config.logging.level.parse().expect("log level");
    if config.logging.enabled {
        println!(
            "handled a request on {}:{} at level {}",
            config.hostname, config.port, level
        );
    }
}
```

The `parse()` call in `handle_request` is the line that panicked.
It is also the only place in the program that lists the accepted log levels.

## Why the Reload Said Yes

`toml::from_str` answers one question.
Does this text match the shape of these structs?

The reload needed a different question answered.
Is this configuration safe to run?

Look at what the four fields promise once they deserialize.
`logging.enabled` is the only field that cannot go wrong.
A `bool` has two values and needs no further interpretation.
`port` is a `u16`, which covers the range of port numbers.
That type accepts `0` and the well-known ports below 1,024, which this service may not want.
`hostname` is a `String`.
The empty string satisfies that type as well as an address does.
`level` is a `String`.
The accepted levels are named in the `FromStr` impl, which runs at first use.

The checks that decide whether a configuration is safe exist in the codebase.
They do not run at the reload point.
Each one runs where its value is first interpreted, inside a `parse`, a `try_into`, or a `match` arm.
In a long-lived service, that can happen minutes after the swap, on a request path.
The reload gate checks shape.
The swap commits to the new configuration before any value is interpreted.

## serde Reports One Problem Per Attempt

Suppose the same edit also broke `enabled` and `port`.
Both are type errors, which deserialization does catch.

```toml
hostname = ""
port = 99999

[logging]
level = "infp"
enabled = "yes"
```

The first reload attempt reports one of them.

```text
TOML parse error at line 6, column 11
  |
6 | enabled = "yes"
  |           ^^^^^
invalid type: string "yes", expected a boolean
```

Fix that and attempt the reload again.

```text
TOML parse error at line 2, column 8
  |
2 | port = 99999
  |        ^^^^^
invalid value: integer `99999`, expected u16
```

Fix that too.
The third attempt succeeds, with `hostname = ""` and `level = "infp"` in the file.

By design, serde fails fast.
As soon as one field fails to deserialize, `Deserialize` returns that error and stops.
For a data format that behavior is correct, because a message read off a socket has no reason to be interpreted past a malformed field.
For a configuration file that a person edits by hand, it means one reload attempt per problem.
You cannot tell how many attempts are left.

Both errors carry a line, a column, and a caret under the offending text.
The `toml` crate parses through a spanned document model, so it hands serde the position along with the value.
The location is available only while deserialization is running.
By the time `level` is parsed on the request path, the value is a plain `String` with no record of its origin.
At that point you can report that the level is unknown, but you cannot say which line of which file it came from.

## What a Confident Reload Needs

Working backward from the failures above, a reload you can trust needs six things.

1. Every check that can reject the configuration runs before the swap.
2. No check can panic, because taking down a long-lived service over a typo is worse than refusing the edit.
3. All of the problems arrive in one verdict, so you make one editing pass instead of one attempt per problem.
4. The verdict is actionable, naming the file, the line, and the column of each problem.
5. After the swap, nothing in the configuration can fail, because no value is left awaiting interpretation.
6. The result is an owned snapshot that swaps atomically, so the previous configuration keeps serving until the new one has been checked.

Error accumulation is item 3, and source spans are item 4.
Each is useful on its own.
Each is here so that item 1 can be acted on.
A gate that rejects the file without listing every problem sends you back for a second attempt.

## Where confval Came From

The code that became confval was extracted from my reverse proxy, [Snakeway](https://snakeway.dev/).
I started with a TOML file and serde.
That held until Snakeway needed to reload its configuration without restarting.

Snakeway configures services, upstreams, routes, static files, health checks, traffic management, WebSockets, and more.
Reverse proxies nest configuration deeply.
Expressing that nesting in TOML became painful early.
Snakeway now uses [HCL](https://github.com/hashicorp/hcl), the HashiCorp Configuration Language, which composes nested blocks directly.
The configuration surface also spread across many files, which made one problem per attempt expensive.
That surface needed its own version, separate from the internals it feeds.
That requirement produced the two-layer design described below.

I could not find a crate that covered the whole job.
There are many good crates covering parts of it.
`config` and `figment` load and merge layered sources.
`validator` and `garde` attach validation rules to structs.
`serde_spanned` maps TOML values back to their location.
I used several of them along the way.
None carried a span from the file through validation into a narrowed runtime type.

## The confval Approach

Alexis King's ["Parse, don't validate"](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) makes illegal states unrepresentable by construction.
confval applies that idea as a pipeline rather than as a set of newtypes.
A file moves through four stages in a fixed order: parse, validate, gate, and lower.
Each stage exists to satisfy a line of the list above.

You describe the configuration as two parallel struct layers.
A spec type holds what the file said.
A config type holds the resolved values the program runs on.
Validation reads the spec layer, so it sees every field before any value is converted.

### Spec Types Keep the Span and the Raw Value

A spec is a plain struct whose fields carry a `Located<T>`, either directly, or inside a `Vec` for a list, or inside an `Option` for something the file may omit.
`Located` is a value together with the span it was parsed from.
A span is a byte range plus the identifier of the source it points into.
One report can therefore cover many files.

The types are the loosest ones that still parse.
A port is an `i64`, not a `u16`.
If parsing rejected `99999` on the spot, the verdict on the file would be split across two phases.
You would be back to one problem per attempt.
Parsed as an `i64`, the value reaches validation with its location intact, where it is judged alongside everything else.

```rust
use confval::prelude::*;

range_constraint!(PORT, i64, min: 1, max: 65535);

keyword_enum!(pub Level, {
    Error => "error",
    Warn  => "warn",
    Info  => "info",
    Debug => "debug",
});

#[derive(confval::Spec)]
struct ServerSpec {
    hostname: Located<String>,
    port: Located<i64>,
    #[confval(nested)]
    logging: Option<Located<LoggingSpec>>,
}

#[derive(confval::Spec)]
#[confval(derive_default)]
struct LoggingSpec {
    #[confval(default = "info".to_string())]
    level: Located<String>,
    #[confval(default = true)]
    enabled: Located<bool>,
}
```

`#[derive(confval::Spec)]` writes the parser.
It checks structure only, meaning whether each field is present and has the right shape.
Three attributes control the rest.

- `#[confval(default = ...)]` fills a field the file leaves out, which makes `level` and `enabled` optional while `hostname` and `port` stay required.
- `#[confval(nested)]` marks a field that holds another spec type, and the `Option` around it means the whole `logging` block may be omitted.
- `#[confval(derive_default)]` builds `LoggingSpec::default()` from those same field defaults, which is what an omitted block lowers from.

`keyword_enum!` declares the log levels once.
It generates the `Level` enum, the list of accepted keywords, and the conversion from string to variant, all from the same table.

### Validation Collects Every Problem

Type shape is settled once parsing succeeds.
The remaining rules go in a `Validate` impl on each spec type.
Each rule reports against the span attached to the field.
Every rule appends to a shared `Report` instead of returning.
Nothing here unwinds, and nothing here stops early.

```rust
impl Validate for ServerSpec {
    fn validate(&self, report: &mut Report) {
        if self.hostname.value.is_empty() {
            report
                .error("hostname must not be empty")
                .at(self.hostname.span)
                .help("Set hostname to a reachable address, e.g. \"127.0.0.1\".")
                .emit();
        }

        PORT.check_located(&self.port, "port", report);
    }
}

impl Validate for LoggingSpec {
    fn validate(&self, report: &mut Report) {
        Level::keyword_set().check_located(&self.level, "level", report);
    }
}
```

`range_constraint!` declares a numeric bound once as a constant.
`check_located` tests a value against it and attaches the span.
`Level::keyword_set()` returns the `KeywordSet` that `keyword_enum!` generated.
The accepted levels are declared once and checked against the file during validation.
For anything else you build an issue directly, starting from `.error()` or `.warning()`, attaching a span with `.at()` and a suggestion with `.help()`, and pushing it onto the report with `.emit()`.

Each impl covers only its own type's fields.
The call that runs them is `validate_all`, which runs `validate` on the value it is called on and then descends into every `#[confval(nested)]` field beneath it, recursively.
`#[derive(confval::Spec)]` generates that traversal from the struct definition.
A nested block added tomorrow is validated without anyone editing a parent's validator.
One call at the root covers the whole tree, however far the configuration surface grows.

### The Gate

After validation you have a report and a spec.
The gate is the check that decides whether to continue.

```rust
if report.has_errors() {
    // render the report, refuse the reload, keep serving the old configuration
}
```

confval does not do this for you.
You check `report.has_errors()` after validation and decide what refusing means in your program.
For a reload that means returning the rendered report and leaving the running configuration alone.
At startup it usually means printing the report and exiting.

The narrowing helpers below report an error rather than panicking.
An ungated lowering therefore corrupts nothing.
Without the gate, lowering adds its own errors to a report that has named the same values in clearer terms.

### Lowering Narrows What Validation Already Checked

A config type declares how each field converts from its spec counterpart.

```rust
#[derive(confval::Config)]
#[confval(lower_from = ServerSpec)]
struct ServerConfig {
    hostname: String,
    #[confval(lower(from = port, with = narrow::i64_to_u16))]
    port: u16,
    #[confval(nested, default)]
    logging: LoggingConfig,
}

#[derive(confval::Config)]
#[confval(lower_from = LoggingSpec)]
struct LoggingConfig {
    #[confval(lower(from = level, with = narrow::keyword::<Level>))]
    level: Level,
    enabled: bool,
}
```

Look at `level` first.
On the spec side it is a `Located<String>`, because that is what the file contains.
On the config side it is a `Level`, because that is what the program means.
`narrow::keyword::<Level>` performs that conversion once, during lowering, after validation has confirmed the string is one of the four accepted keywords.

That removes the panic from the opening rather than relocating it.
`handle_request` now receives a `Level`.
There is no `parse` on the request path and no `expect` that can fail.

```rust
fn handle_request(config: &ServerConfig) {
    if config.logging.enabled {
        println!(
            "handled a request on {}:{} at level {}",
            config.hostname, config.port, config.logging.level
        );
    }
}
```

The other three fields lower like this.

- `hostname` has no attribute, so it maps across on its own with the `Located` wrapper stripped.
- `port` narrows from `i64` to `u16` through a `with` function, and the range rule plus the gate mean that narrowing never sees an out-of-range value.
- `logging` is `Option<Located<LoggingSpec>>` on the spec side and a plain `LoggingConfig` on the config side, where `#[confval(nested, default)]` lowers an omitted block from `LoggingSpec::default()`.

Where a range rule is missing, the `narrow` helpers use `try_from` rather than `as`.
The conversion then reports a located error instead of truncating the value.

The generated lowering destructures the spec with no rest pattern, so a field added to one layer without a counterpart on the other fails to compile.

Lowering produces an owned struct with no borrows of the source text.
That is the snapshot the reload swaps in.

## The Reload Path

Startup and reload run the same pipeline.
`load` runs the four stages and returns either the snapshot or the rendered report.
`reload` calls it and swaps only on success.

```rust
fn load(name: &str, text: &str) -> Result<ServerConfig, String> {
    let mut sources = SourceMap::new();
    let mut report = Report::new();
    let id = sources.add(name, text);

    let spec: Option<ServerSpec> = confval::format::toml::parse_toml(&sources, id, &mut report);
    if let Some(spec) = &spec {
        spec.validate_all(&mut report);
    }

    if report.has_errors() {
        let mut rendered = String::new();
        report
            .render_pretty(&sources, &mut rendered)
            .map_err(|error| error.to_string())?;
        return Err(rendered);
    }

    let spec = spec.ok_or("parse returned None without reporting an error")?;
    ServerConfig::lower(&spec, &mut report).ok_or_else(|| "validated config lowers".to_string())
}

fn reload(current: &RwLock<Arc<ServerConfig>>, name: &str, text: &str) -> Result<(), String> {
    let next = load(name, text)?;
    *current.write().map_err(|_| "config lock poisoned")? = Arc::new(next);
    Ok(())
}
```

Give that the same edit from the opening, with the bad port added back so all three problems are present at once.

```toml
hostname = ""
port = 99999

[logging]
level = "infp"
```

Here is a run that serves a request, attempts that reload, serves another request, then reloads a corrected file and serves a third.

```text
handled a request on 127.0.0.1:8443 at level info
error: hostname must not be empty
 --> server.toml:1:12
  |
1 | hostname = ""
  |            ^^
  = help: Set hostname to a reachable address, e.g. "127.0.0.1".

error: port must be at most 65535
 --> server.toml:2:8
  |
2 | port = 99999
  |        ^^^^^
  = help: Set port to at most 65535

error: unknown level: infp
 --> server.toml:5:9
  |
5 | level = "infp"
  |         ^^^^^^
  = help: expected one of: error, warn, info, debug

reload refused, the running configuration is untouched
handled a request on 127.0.0.1:8443 at level info
reload accepted
handled a request on 0.0.0.0:9443 at level debug
```

The report covers three problems across two levels of nesting, each at the line and column it came from.
The service kept serving on the old configuration the whole time.
You made one editing pass.
The second attempt swapped.

Compare that to the transcript at the top of this post.
Deserialization caught the type errors and accepted the two values that were merely wrong.
confval reported all three before the swap, so the running configuration was never replaced.

Structural problems accumulate among themselves, and semantic problems accumulate among themselves.
A file that fails to parse does not report its semantic problems in the same run.
An unknown field name gets you every structural complaint about the file and nothing about the meaning of values that were never built.

## Format, Renderer, and Version Are Separate Choices

Every stage after parsing works against a format-neutral field model.

The example above reads TOML through `parse_toml`.
Switch that one call to `parse_hcl` or `parse_kdl` and enable the matching feature.
The same spec types, validators, and config types then read the same configuration in HCL or KDL.

The renderer is a separate choice from the pipeline.

- `render_pretty` produces the rustc-style output above and needs the `color` feature.
- `render_plain` produces one line per issue for CI and needs no features.
- `render_json` produces structured output for tooling and needs the `serde` feature.

The spec layer can be versioned on its own schedule, because it is a distinct set of types from the runtime layer.
More than one spec version can lower into the same runtime types.
The file format can then change without the rest of the program moving with it.

## If You Do Not Hot Reload

A service that reads its configuration once, at startup, still discovers bad values late, when a code path first interprets them.
The same pipeline closes that gap.
`load` above is the startup path and the reload path both.
At startup you print the report and exit instead of continuing to serve.

## When Not to Use confval

confval fits configuration that people edit by hand, where a wrong value is expensive to catch late.
It is more than you need when:

- your configuration maps cleanly onto runtime types and one error at a time is fine.
- you read a format other than TOML, HCL, or KDL, which means writing a frontend.
- two struct layers per configuration surface is more typing than you want.
- you need a settled API, which a pre-1.0 crate does not offer.

In the first case, plain serde is less code.

## Wrap-up

confval trades one deserialize step for a short pipeline.
It parses into span-carrying spec types, validates every field into a shared report, gates on errors, and then lowers into the runtime types.

Every check that can reject the configuration runs before the swap.
Each problem is reported with its line and column in one pass.
The swap installs an owned snapshot with no value left to interpret.
A reload that is accepted leaves nothing for a request path to fail on.

If you want to try it:

```shell
cargo add confval --features "toml,derive,color"
```

Swap `toml` for `hcl` or `kdl` to match the format you read.

The [documentation](https://ethanhann.com/confval/docs/getting-started) has a full walkthrough, the source is on [GitHub](https://github.com/ethanhann/confval), and the crate is on [crates.io](https://crates.io/crates/confval).
For a real project that uses it, [snakeway-conf](https://github.com/snakewayhq/snakeway/tree/main/crates/snakeway-conf/src) is the configuration layer of Snakeway.
