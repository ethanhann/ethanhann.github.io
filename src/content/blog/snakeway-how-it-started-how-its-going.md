---
title: "Snakeway: How It Started vs. How It's Going"
date: 2026-07-15
description: Snakeway Project Progress Snapshot
ogImage: ../../assets/blog/snakeway_how_it_started_how_its_going/snakeway_og_image.png
ogImageAlt: Snakeway Project Progress Snapshot
---

I often tell less-experienced engineers that, even though we arrange our work into sprints, software
development is a marathon.

You have to pace yourself to not burn out, but you also have to periodically pull your head up from your work
to reflect on how far you've come.

Otherwise, it all seems like a blur.

I've been working on my [Snakeway](https://snakeway.dev/) project for about seven months.
I started thinking about this idea long before that, though.
I spent a bit of time working on edge computing in my career.
Trying to squeeze milliseconds out of requests.
A/B testing JSON parsers.
Modifying, building, and deploying customized nginx modules.
Tuning caches to speed up hot request paths.
All of this experience has left me with a lot of opinions about how reverse proxies should work.
I am pleased thus far with the progress I've made turning this experience into an OSS project. 

As of the latest release (v0.15.0), I only have about 50% of my total vision accomplished.
There are caching features, a plugin ecosystem, and all sorts of things from the roadmap still left to add.

Exciting stuff.

Below is a snapshot, using the `tree` utility, of the `v0.1.0` and the `v0.15.0` repo file trees for comparison.

After this, next up on the agenda is a comprehensive, reproducible benchmark suite.

## How is started (v0.1.0):

```shell
.
├── Cargo.lock
├── Cargo.toml
├── CONTRIBUTING.md
├── Justfile
└── snakeway
    ├── Cargo.toml
    └── src
        ├── config.rs
        ├── logging.rs
        ├── main.rs
        ├── proxy.rs
        └── server.rs

3 directories, 10 files
```

## How it's going (v0.15.0):

```shell
.
├── Cargo.lock
├── Cargo.toml
├── CONTRIBUTING.md
├── crates
│   ├── confval
│   │   ├── Cargo.toml
│   │   ├── examples
│   │   │   ├── hcl.rs
│   │   │   └── toml.rs
│   │   ├── README.md
│   │   ├── src
│   │   │   ├── diagnostic
│   │   │   │   ├── mod.rs
│   │   │   │   ├── render.rs
│   │   │   │   ├── report.rs
│   │   │   │   └── severity.rs
│   │   │   ├── format
│   │   │   │   ├── field.rs
│   │   │   │   ├── hcl.rs
│   │   │   │   ├── mod.rs
│   │   │   │   └── toml.rs
│   │   │   ├── lib.rs
│   │   │   ├── pipeline
│   │   │   │   ├── keyword.rs
│   │   │   │   ├── lower.rs
│   │   │   │   ├── mod.rs
│   │   │   │   ├── narrow.rs
│   │   │   │   ├── range.rs
│   │   │   │   └── validate.rs
│   │   │   └── source
│   │   │       ├── located.rs
│   │   │       ├── mod.rs
│   │   │       ├── source_map.rs
│   │   │       └── span.rs
│   │   └── tests
│   │       ├── compile_fail.rs
│   │       ├── hcl_end_to_end.rs
│   │       ├── hcl_span_fidelity.rs
│   │       └── ui
│   │           ├── fail
│   │           │   ├── config_default_on_optional_nested.rs
│   │           │   ├── config_default_on_optional_nested.stderr
│   │           │   ├── config_lower_bad_from.rs
│   │           │   ├── config_lower_bad_from.stderr
│   │           │   ├── config_lower_missing_from.rs
│   │           │   ├── config_lower_missing_from.stderr
│   │           │   ├── config_lower_missing_with.rs
│   │           │   ├── config_lower_missing_with.stderr
│   │           │   ├── config_lower_unknown_key.rs
│   │           │   ├── config_lower_unknown_key.stderr
│   │           │   ├── config_missing_lower_from.rs
│   │           │   ├── config_missing_lower_from.stderr
│   │           │   ├── config_on_enum.rs
│   │           │   ├── config_on_enum.stderr
│   │           │   ├── config_spec_only_not_ident.rs
│   │           │   ├── config_spec_only_not_ident.stderr
│   │           │   ├── config_tuple_struct.rs
│   │           │   ├── config_tuple_struct.stderr
│   │           │   ├── config_unconsumed_spec_field.rs
│   │           │   ├── config_unconsumed_spec_field.stderr
│   │           │   ├── config_unknown_field_attribute.rs
│   │           │   ├── config_unknown_field_attribute.stderr
│   │           │   ├── config_unknown_struct_attribute.rs
│   │           │   ├── config_unknown_struct_attribute.stderr
│   │           │   ├── config_validate_without_impl.rs
│   │           │   ├── config_validate_without_impl.stderr
│   │           │   ├── spec_bare_field.rs
│   │           │   ├── spec_bare_field.stderr
│   │           │   ├── spec_default_on_nested.rs
│   │           │   ├── spec_default_on_nested.stderr
│   │           │   ├── spec_list_not_string.rs
│   │           │   ├── spec_list_not_string.stderr
│   │           │   ├── spec_nested_list_not_located.rs
│   │           │   ├── spec_nested_list_not_located.stderr
│   │           │   ├── spec_nested_not_located.rs
│   │           │   ├── spec_nested_not_located.stderr
│   │           │   ├── spec_on_enum.rs
│   │           │   ├── spec_on_enum.stderr
│   │           │   ├── spec_optional_nested_list.rs
│   │           │   ├── spec_optional_nested_list.stderr
│   │           │   ├── spec_required_wrapped_string_list.rs
│   │           │   ├── spec_required_wrapped_string_list.stderr
│   │           │   ├── spec_tuple_struct.rs
│   │           │   ├── spec_tuple_struct.stderr
│   │           │   ├── spec_unknown_attribute.rs
│   │           │   ├── spec_unknown_attribute.stderr
│   │           │   ├── spec_unsupported_leaf.rs
│   │           │   └── spec_unsupported_leaf.stderr
│   │           └── pass
│   │               ├── config_validate_bound.rs
│   │               └── derive_roundtrip.rs
│   ├── confval-derive
│   │   ├── Cargo.toml
│   │   ├── README.md
│   │   └── src
│   │       ├── common.rs
│   │       ├── config.rs
│   │       ├── lib.rs
│   │       └── spec
│   │           ├── mod.rs
│   │           ├── options.rs
│   │           └── shape.rs
│   ├── snakeway
│   │   ├── Cargo.toml
│   │   └── src
│   │       ├── cli
│   │       │   ├── bootstrap.rs
│   │       │   ├── logs
│   │       │   │   ├── constants.rs
│   │       │   │   ├── histogram.rs
│   │       │   │   ├── mod.rs
│   │       │   │   ├── parse.rs
│   │       │   │   ├── render.rs
│   │       │   │   ├── run.rs
│   │       │   │   ├── stats_aggregation.rs
│   │       │   │   └── types.rs
│   │       │   ├── mod.rs
│   │       │   ├── reload.rs
│   │       │   ├── route
│   │       │   │   ├── args.rs
│   │       │   │   ├── mod.rs
│   │       │   │   └── solve
│   │       │   │       ├── mod.rs
│   │       │   │       ├── route_solve.rs
│   │       │   │       ├── solver.rs
│   │       │   │       └── types.rs
│   │       │   ├── upgrade.rs
│   │       │   └── wasm_device.rs
│   │       ├── lib.rs
│   │       ├── main.rs
│   │       └── server
│   │           ├── bootstrap.rs
│   │           ├── control_plane_server.rs
│   │           ├── mod.rs
│   │           ├── pid.rs
│   │           └── runtime_server.rs
│   ├── snakeway-acme
│   │   ├── Cargo.toml
│   │   └── src
│   │       ├── acme_client.rs
│   │       ├── admin.rs
│   │       ├── cert_store
│   │       │   ├── filesystem.rs
│   │       │   ├── memory.rs
│   │       │   ├── mod.rs
│   │       │   └── store_trait.rs
│   │       ├── challenge
│   │       │   ├── http01.rs
│   │       │   └── mod.rs
│   │       ├── error.rs
│   │       ├── lib.rs
│   │       ├── manager.rs
│   │       ├── order_store
│   │       │   ├── filesystem.rs
│   │       │   ├── mod.rs
│   │       │   └── store_trait.rs
│   │       ├── parsed_cert.rs
│   │       ├── reconcile.rs
│   │       ├── renewal_policy.rs
│   │       ├── sni_registry.rs
│   │       └── state.rs
│   ├── snakeway-conf
│   │   ├── Cargo.toml
│   │   └── src
│   │       ├── discover.rs
│   │       ├── lib.rs
│   │       ├── loader.rs
│   │       ├── lower.rs
│   │       ├── parse.rs
│   │       ├── resolution.rs
│   │       ├── types
│   │       │   ├── mod.rs
│   │       │   ├── runtime
│   │       │   │   ├── device
│   │       │   │   │   ├── device_config.rs
│   │       │   │   │   ├── identity_device_config.rs
│   │       │   │   │   ├── mod.rs
│   │       │   │   │   ├── network_policy_device_config.rs
│   │       │   │   │   ├── request_filter_device_config.rs
│   │       │   │   │   ├── request_rate_limiting_device_config.rs
│   │       │   │   │   ├── structured_logging_device_config.rs
│   │       │   │   │   └── wasm_device_config.rs
│   │       │   │   ├── listener
│   │       │   │   │   ├── admin_auth
│   │       │   │   │   │   ├── bearer_auth_config.rs
│   │       │   │   │   │   ├── mod.rs
│   │       │   │   │   │   └── secret_token.rs
│   │       │   │   │   ├── connection_rate_limiting_filter_config.rs
│   │       │   │   │   ├── http2_config.rs
│   │       │   │   │   ├── listener_config.rs
│   │       │   │   │   ├── mod.rs
│   │       │   │   │   ├── network_connection_filter_config.rs
│   │       │   │   │   └── tls_termination_config.rs
│   │       │   │   ├── mod.rs
│   │       │   │   ├── route
│   │       │   │   │   ├── mod.rs
│   │       │   │   │   ├── route_config.rs
│   │       │   │   │   ├── service_route_config.rs
│   │       │   │   │   └── static_route_config.rs
│   │       │   │   ├── server_config.rs
│   │       │   │   └── service
│   │       │   │       ├── circuit_breaker_config.rs
│   │       │   │       ├── health_check_config.rs
│   │       │   │       ├── mod.rs
│   │       │   │       ├── service_config.rs
│   │       │   │       └── upstream_config.rs
│   │       │   └── specification
│   │       │       ├── device
│   │       │       │   ├── device_spec.rs
│   │       │       │   ├── identity_device_spec.rs
│   │       │       │   ├── mod.rs
│   │       │       │   ├── network_policy_device_spec.rs
│   │       │       │   ├── request_filter_device_spec.rs
│   │       │       │   ├── request_rate_limiting_device_spec.rs
│   │       │       │   ├── structured_logging_device_spec.rs
│   │       │       │   └── wasm_device_spec.rs
│   │       │       ├── entrypoint_spec.rs
│   │       │       ├── ingress
│   │       │       │   ├── bind
│   │       │       │   │   ├── bind_spec.rs
│   │       │       │   │   ├── connection_rate_limiting_filter_spec.rs
│   │       │       │   │   ├── http2_spec.rs
│   │       │       │   │   ├── mod.rs
│   │       │       │   │   ├── network_connection_filter_spec.rs
│   │       │       │   │   ├── redirect_spec.rs
│   │       │       │   │   └── tls_termination_spec.rs
│   │       │       │   ├── bind_admin
│   │       │       │   │   ├── admin_auth_spec.rs
│   │       │       │   │   ├── bind_admin_spec.rs
│   │       │       │   │   └── mod.rs
│   │       │       │   ├── bind_interface_spec.rs
│   │       │       │   ├── ingress_spec.rs
│   │       │       │   ├── mod.rs
│   │       │       │   ├── service
│   │       │       │   │   ├── circuit_breaker_spec.rs
│   │       │       │   │   ├── health_check_spec.rs
│   │       │       │   │   ├── mod.rs
│   │       │       │   │   ├── service_route_spec.rs
│   │       │       │   │   ├── service_spec.rs
│   │       │       │   │   └── upstream_spec.rs
│   │       │       │   └── static_files
│   │       │       │       ├── mod.rs
│   │       │       │       ├── static_files_spec.rs
│   │       │       │       └── static_route_spec.rs
│   │       │       ├── mod.rs
│   │       │       └── server
│   │       │           ├── mod.rs
│   │       │           ├── observability_spec.rs
│   │       │           ├── server_spec.rs
│   │       │           ├── tls_automation_spec.rs
│   │       │           └── wasm_spec.rs
│   │       └── validation
│   │           ├── error.rs
│   │           ├── mod.rs
│   │           ├── multi_file
│   │           │   ├── mod.rs
│   │           │   └── tls.rs
│   │           ├── single_file
│   │           │   ├── device.rs
│   │           │   ├── ingress.rs
│   │           │   └── mod.rs
│   │           ├── validate.rs
│   │           └── validator
│   │               ├── filesystem.rs
│   │               ├── http.rs
│   │               ├── mod.rs
│   │               ├── net.rs
│   │               ├── path.rs
│   │               ├── tls.rs
│   │               └── token_file.rs
│   ├── snakeway-engine
│   │   ├── benches
│   │   │   ├── device_pipeline.rs
│   │   │   ├── header_scaling.rs
│   │   │   ├── identity.rs
│   │   │   ├── request_filter.rs
│   │   │   └── router.rs
│   │   ├── Cargo.toml
│   │   └── src
│   │       ├── execution
│   │       │   ├── ctx
│   │       │   │   ├── mod.rs
│   │       │   │   ├── request
│   │       │   │   │   ├── error.rs
│   │       │   │   │   ├── mod.rs
│   │       │   │   │   ├── normalization
│   │       │   │   │   │   ├── headers.rs
│   │       │   │   │   │   ├── http1_headers.rs
│   │       │   │   │   │   ├── http2_headers.rs
│   │       │   │   │   │   ├── mod.rs
│   │       │   │   │   │   ├── path.rs
│   │       │   │   │   │   ├── query.rs
│   │       │   │   │   │   └── types.rs
│   │       │   │   │   ├── normalized_request.rs
│   │       │   │   │   ├── request_ctx.rs
│   │       │   │   │   ├── request_id.rs
│   │       │   │   │   └── request_source.rs
│   │       │   │   ├── response_ctx.rs
│   │       │   │   ├── ws_close_ctx.rs
│   │       │   │   └── ws_ctx.rs
│   │       │   ├── device
│   │       │   │   ├── builtin
│   │       │   │   │   ├── identity.rs
│   │       │   │   │   ├── mod.rs
│   │       │   │   │   ├── network_policy.rs
│   │       │   │   │   ├── request_filter.rs
│   │       │   │   │   ├── request_rate_limiting.rs
│   │       │   │   │   └── structured_logging.rs
│   │       │   │   ├── core
│   │       │   │   │   ├── device_trait.rs
│   │       │   │   │   ├── errors.rs
│   │       │   │   │   ├── mod.rs
│   │       │   │   │   ├── pipeline.rs
│   │       │   │   │   ├── registry.rs
│   │       │   │   │   └── result.rs
│   │       │   │   ├── mod.rs
│   │       │   │   └── wasm
│   │       │   │       ├── bindings.rs
│   │       │   │       ├── engine.rs
│   │       │   │       ├── lifecycle.rs
│   │       │   │       ├── mod.rs
│   │       │   │       ├── state.rs
│   │       │   │       └── wasm_device.rs
│   │       │   ├── downstream_sni.rs
│   │       │   ├── enrichment
│   │       │   │   ├── mod.rs
│   │       │   │   └── user_agent
│   │       │   │       ├── mod.rs
│   │       │   │       ├── regexes.yaml
│   │       │   │       ├── uaparser_engine.rs
│   │       │   │       └── woothee_engine.rs
│   │       │   ├── mod.rs
│   │       │   ├── route
│   │       │   │   ├── mod.rs
│   │       │   │   ├── router.rs
│   │       │   │   └── types.rs
│   │       │   ├── traffic
│   │       │   │   ├── admin.rs
│   │       │   │   ├── admission_guard.rs
│   │       │   │   ├── algorithms
│   │       │   │   │   ├── failover.rs
│   │       │   │   │   ├── mod.rs
│   │       │   │   │   ├── random.rs
│   │       │   │   │   ├── request_pressure.rs
│   │       │   │   │   ├── round_robin.rs
│   │       │   │   │   └── sticky_hash.rs
│   │       │   │   ├── circuit.rs
│   │       │   │   ├── decision.rs
│   │       │   │   ├── director.rs
│   │       │   │   ├── manager
│   │       │   │   │   ├── circuit_breaker_api.rs
│   │       │   │   │   ├── health_api.rs
│   │       │   │   │   ├── mod.rs
│   │       │   │   │   ├── request_counter_api.rs
│   │       │   │   │   ├── snapshot_api.rs
│   │       │   │   │   ├── traffic_manager.rs
│   │       │   │   │   └── types.rs
│   │       │   │   ├── mod.rs
│   │       │   │   ├── snapshot.rs
│   │       │   │   ├── strategy.rs
│   │       │   │   └── types.rs
│   │       │   └── ws_connection_management
│   │       │       ├── guard.rs
│   │       │       ├── manager.rs
│   │       │       ├── mod.rs
│   │       │       └── state.rs
│   │       ├── lib.rs
│   │       └── runtime
│   │           ├── diff.rs
│   │           ├── dns_refresh.rs
│   │           ├── error.rs
│   │           ├── mod.rs
│   │           ├── state.rs
│   │           └── types.rs
│   ├── snakeway-jwt-auth-device
│   │   ├── Cargo.toml
│   │   └── src
│   │       ├── config.rs
│   │       ├── jwt_auth_device.rs
│   │       ├── lib.rs
│   │       ├── token_validation.rs
│   │       └── types.rs
│   ├── snakeway-net
│   │   ├── Cargo.toml
│   │   └── src
│   │       ├── cidr.rs
│   │       ├── client_ip.rs
│   │       ├── connection_rate_limiting_filter.rs
│   │       ├── lib.rs
│   │       └── network_connection_filter.rs
│   ├── snakeway-observability
│   │   ├── Cargo.toml
│   │   └── src
│   │       ├── lib.rs
│   │       ├── logging.rs
│   │       ├── metrics.rs
│   │       ├── telemetry.rs
│   │       └── trace_context.rs
│   ├── snakeway-proxy
│   │   ├── Cargo.toml
│   │   └── src
│   │       ├── bootstrap.rs
│   │       ├── lib.rs
│   │       ├── proxy
│   │       │   ├── admin_gateway.rs
│   │       │   ├── error_classification.rs
│   │       │   ├── gateway_ctx.rs
│   │       │   ├── handlers
│   │       │   │   ├── admin.rs
│   │       │   │   ├── mod.rs
│   │       │   │   └── static_file.rs
│   │       │   ├── mod.rs
│   │       │   ├── public_gateway.rs
│   │       │   └── redirect_gateway.rs
│   │       ├── reload.rs
│   │       ├── static_files
│   │       │   ├── handler.rs
│   │       │   ├── mod.rs
│   │       │   ├── render
│   │       │   │   ├── compression.rs
│   │       │   │   ├── directory.rs
│   │       │   │   ├── etag.rs
│   │       │   │   ├── file.rs
│   │       │   │   ├── headers.rs
│   │       │   │   ├── mod.rs
│   │       │   │   └── range.rs
│   │       │   ├── resolve.rs
│   │       │   └── response.rs
│   │       ├── tls_handshake
│   │       │   ├── mod.rs
│   │       │   └── snakeway_tls_accept.rs
│   │       └── upgrade.rs
│   ├── snakeway-tests
│   │   ├── build.rs
│   │   ├── Cargo.toml
│   │   ├── fixtures
│   │   │   ├── geoip
│   │   │   │   └── dbip-country-lite-2025-12.mmdb
│   │   │   ├── http
│   │   │   │   ├── browsers
│   │   │   │   │   ├── chrome_fetch.http
│   │   │   │   │   ├── chrome_navigation.http
│   │   │   │   │   └── firefox_navigation.http
│   │   │   │   ├── connection
│   │   │   │   │   ├── connection_close.http
│   │   │   │   │   ├── expect_100_continue.http
│   │   │   │   │   ├── http10_get.http
│   │   │   │   │   ├── http10_keep_alive.http
│   │   │   │   │   └── many_header_fields.http
│   │   │   │   ├── cookies
│   │   │   │   │   ├── cookie_special_chars.http
│   │   │   │   │   ├── large_cookie.http
│   │   │   │   │   └── many_cookies.http
│   │   │   │   ├── encoding
│   │   │   │   │   ├── chunked_invalid_size.http
│   │   │   │   │   ├── chunked_multi_chunk.http
│   │   │   │   │   ├── chunked_simple.http
│   │   │   │   │   ├── content_encoding_gzip_passthrough.http
│   │   │   │   │   └── large_body.http
│   │   │   │   ├── headers
│   │   │   │   │   ├── duplicate_header.http
│   │   │   │   │   ├── empty_header_value.http
│   │   │   │   │   ├── forwarded_rfc7239.http
│   │   │   │   │   ├── hop_by_hop.http
│   │   │   │   │   ├── long_header_value.http
│   │   │   │   │   └── x_forwarded_for_existing.http
│   │   │   │   ├── malformed
│   │   │   │   │   ├── absolute_uri.http
│   │   │   │   │   ├── content_length_body_underflow.http
│   │   │   │   │   ├── invalid_version.http
│   │   │   │   │   ├── missing_host.http
│   │   │   │   │   ├── negative_content_length.http
│   │   │   │   │   ├── non_numeric_content_length.http
│   │   │   │   │   ├── request_line_no_version.http
│   │   │   │   │   └── whitespace_before_method.http
│   │   │   │   ├── methods
│   │   │   │   │   ├── delete_resource.http
│   │   │   │   │   ├── get_minimal.http
│   │   │   │   │   ├── get_with_body.http
│   │   │   │   │   ├── head_request.http
│   │   │   │   │   ├── options_cors_preflight.http
│   │   │   │   │   ├── patch_update.http
│   │   │   │   │   ├── post_json.http
│   │   │   │   │   └── put_update.http
│   │   │   │   ├── security
│   │   │   │   │   ├── absolute_uri_host_conflict.http
│   │   │   │   │   ├── host_with_port.http
│   │   │   │   │   ├── oversized_request_line.http
│   │   │   │   │   └── unknown_host.http
│   │   │   │   ├── smuggling
│   │   │   │   │   ├── chunked_then_cl.http
│   │   │   │   │   ├── cl_te.http
│   │   │   │   │   ├── dual_content_length.http
│   │   │   │   │   ├── header_field_injection.http
│   │   │   │   │   ├── te_chunked_obfuscated.http
│   │   │   │   │   ├── te_cl.http
│   │   │   │   │   └── te_space_before_value.http
│   │   │   │   └── uri
│   │   │   │       ├── dot_segment_path.http
│   │   │   │       ├── empty_query_string.http
│   │   │   │       ├── encoded_path.http
│   │   │   │       ├── long_query_string.http
│   │   │   │       ├── null_byte_in_path.http
│   │   │   │       ├── path_traversal_encoded.http
│   │   │   │       ├── query_string.http
│   │   │   │       └── unicode_encoded_query.http
│   │   │   └── public
│   │   │       ├── 1kb.html
│   │   │       ├── 6kb.html
│   │   │       ├── images
│   │   │       │   └── 1mb.png
│   │   │       └── index.html
│   │   ├── proto
│   │   │   └── helloworld.proto
│   │   ├── src
│   │   │   ├── conf
│   │   │   │   ├── builder
│   │   │   │   │   ├── config_builder.rs
│   │   │   │   │   ├── devices.rs
│   │   │   │   │   ├── mod.rs
│   │   │   │   │   ├── services.rs
│   │   │   │   │   └── static_files.rs
│   │   │   │   ├── minimal_happy_path.rs
│   │   │   │   └── mod.rs
│   │   │   ├── constants.rs
│   │   │   ├── device.rs
│   │   │   ├── harness
│   │   │   │   ├── acme.rs
│   │   │   │   ├── mod.rs
│   │   │   │   ├── replay_http.rs
│   │   │   │   ├── runtime_patch.rs
│   │   │   │   ├── server.rs
│   │   │   │   ├── tracing.rs
│   │   │   │   └── upstream.rs
│   │   │   └── lib.rs
│   │   └── tests
│   │       ├── acme
│   │       │   ├── http01.rs
│   │       │   └── mod.rs
│   │       ├── cli
│   │       │   ├── mod.rs
│   │       │   ├── multi_route_solve.rs
│   │       │   └── route_solve.rs
│   │       ├── configuration
│   │       │   ├── config_cli.rs
│   │       │   ├── env_config.rs
│   │       │   ├── hot_reload.rs
│   │       │   └── mod.rs
│   │       ├── device
│   │       │   ├── identity.rs
│   │       │   ├── mod.rs
│   │       │   ├── network_policy_on_invalid.rs
│   │       │   ├── network_policy.rs
│   │       │   ├── request_filter.rs
│   │       │   ├── request_rate_limiting.rs
│   │       │   ├── structured_logging.rs
│   │       │   └── wasm
│   │       │       ├── after_proxy.rs
│   │       │       ├── jwt_auth.rs
│   │       │       ├── mod.rs
│   │       │       ├── on_request.rs
│   │       │       ├── on_response.rs
│   │       │       ├── on_stream_request_body.rs
│   │       │       └── request_header_writeback.rs
│   │       ├── http_replay
│   │       │   ├── browsers.rs
│   │       │   ├── connection.rs
│   │       │   ├── cookies.rs
│   │       │   ├── encoding.rs
│   │       │   ├── headers.rs
│   │       │   ├── malformed.rs
│   │       │   ├── methods.rs
│   │       │   ├── mod.rs
│   │       │   ├── security.rs
│   │       │   ├── smuggling.rs
│   │       │   └── uri.rs
│   │       ├── mod.rs
│   │       ├── net
│   │       │   ├── connection_filter_allow_list.rs
│   │       │   ├── connection_rate_limiting_filter.rs
│   │       │   ├── mod.rs
│   │       │   └── network_connection_filter.rs
│   │       ├── otel
│   │       │   ├── metrics.rs
│   │       │   ├── mod.rs
│   │       │   └── trace_propagation.rs
│   │       ├── proxy
│   │       │   ├── admin_api.rs
│   │       │   ├── basic_proxy.rs
│   │       │   ├── config_validation.rs
│   │       │   ├── grpc.rs
│   │       │   ├── h2_to_h1.rs
│   │       │   ├── mod.rs
│   │       │   ├── response_handling.rs
│   │       │   ├── routing.rs
│   │       │   ├── static_files.rs
│   │       │   └── websocket.rs
│   │       └── traffic
│   │           ├── circuit_breaker.rs
│   │           ├── health_check.rs
│   │           ├── load_balancing.rs
│   │           └── mod.rs
│   ├── snakeway-wasm-test-device
│   │   ├── Cargo.toml
│   │   └── src
│   │       └── lib.rs
│   └── snakeway-wit
│       ├── Cargo.toml
│       ├── src
│       │   ├── device.rs
│       │   ├── lib.rs
│       │   └── snakeway.rs
│       └── wit
│           ├── device.wit
│           ├── package.wit
│           ├── policy.wit
│           └── world.wit
├── dev
│   ├── docker-compose-dev.yml
│   ├── gen-test-certs.sh
│   ├── just
│   │   ├── benchmark.just
│   │   ├── code_quality.just
│   │   ├── debug.just
│   │   ├── package.just
│   │   ├── publish.just
│   │   ├── test.just
│   │   ├── tools_and_docs.just
│   │   └── wasm.just
│   ├── k6
│   │   ├── jwt-load.js
│   │   ├── load-test.js
│   │   └── spoof-traffic.js
│   ├── nginx-origin.conf
│   ├── otel
│   │   ├── collector.yaml
│   │   ├── grafana-datasources.yaml
│   │   ├── loki-local-config.yaml
│   │   ├── prometheus.yaml
│   │   └── tempo.yaml
│   └── pebble.json
├── docs
│   ├── blog
│   │   └── authors.yml
│   ├── docs
│   │   ├── administration
│   │   │   ├── admin-api.md
│   │   │   ├── cli.md
│   │   │   ├── logging.md
│   │   │   ├── static-files.md
│   │   │   └── tls-cert-management.md
│   │   ├── configuration
│   │   │   ├── devices
│   │   │   │   ├── identity.md
│   │   │   │   ├── network-policy.md
│   │   │   │   ├── request-filter.md
│   │   │   │   ├── request-rate-limiting.md
│   │   │   │   └── structured-logging.md
│   │   │   ├── entry-point
│   │   │   │   ├── index.md
│   │   │   │   ├── server.md
│   │   │   │   └── tls-automation
│   │   │   │       ├── acme.md
│   │   │   │       ├── cert-store.md
│   │   │   │       └── index.md
│   │   │   ├── ingress
│   │   │   │   ├── admin-bind.md
│   │   │   │   ├── bind.md
│   │   │   │   ├── cache-policy.md
│   │   │   │   ├── circuit-breaker.md
│   │   │   │   ├── compression.md
│   │   │   │   ├── connection-filter.md
│   │   │   │   ├── connection-rate-limiter.md
│   │   │   │   ├── index.md
│   │   │   │   ├── routes.md
│   │   │   │   ├── services.md
│   │   │   │   ├── static-files.md
│   │   │   │   ├── upstream-tls.md
│   │   │   │   └── upstreams.md
│   │   │   └── overview.md
│   │   ├── contributing
│   │   │   ├── adding-config-settings.md
│   │   │   ├── benchmarks.md
│   │   │   ├── code-style.md
│   │   │   ├── http-replay-tests.md
│   │   │   ├── integration-tests.md
│   │   │   ├── mermaid-diagrams.md
│   │   │   ├── overview.md
│   │   │   ├── unit-tests.md
│   │   │   └── writing-documentation.md
│   │   ├── extension
│   │   │   ├── authoring-wasm-devices.md
│   │   │   ├── understanding-devices.md
│   │   │   └── wasm-devices
│   │   │       ├── integration-test-example-device.md
│   │   │       └── jwt-auth-device.md
│   │   ├── internals
│   │   │   ├── architecture.md
│   │   │   ├── configuration.md
│   │   │   ├── confval.md
│   │   │   ├── control-plane-and-data-plane.md
│   │   │   ├── hot-reload.md
│   │   │   ├── lifecycle.md
│   │   │   ├── mental-model.mdx
│   │   │   ├── observability.md
│   │   │   ├── tls-cert-renewal.md
│   │   │   └── wasm_devices.md
│   │   └── introduction
│   │       ├── getting-started.md
│   │       ├── roadmap.md
│   │       └── why-snakeway-exists.md
│   ├── docusaurus.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── releases
│   │   ├── authors.yml
│   │   ├── v0_10_0.md
│   │   ├── v0_11_0.md
│   │   ├── v0_11_1.md
│   │   ├── v0_12_0.md
│   │   ├── v0_13_0.md
│   │   ├── v0_13_1.md
│   │   ├── v0_14_0.md
│   │   ├── v0_15_0.md
│   │   ├── v0_15_1.md
│   │   ├── v0_6_0.md
│   │   ├── v0_7_0.md
│   │   ├── v0_8_0.md
│   │   └── v0_9_0.md
│   ├── sidebars.ts
│   ├── src
│   │   ├── components
│   │   │   └── ThemedSvg.tsx
│   │   ├── css
│   │   │   └── custom.css
│   │   └── pages
│   │       └── index.tsx
│   ├── static
│   │   └── img
│   │       ├── diagrams
│   │       │   ├── mental-model
│   │       │   │   └── core-loop.svg
│   │       │   └── philosophy
│   │       │       └── where-snakeway-fits.svg
│   │       ├── favicon.ico
│   │       ├── favicon.svg
│   │       └── logo.svg
│   ├── tsconfig.json
│   ├── versioned_sidebars
│   │   ├── version-0.10.0-sidebars.json
│   │   ├── version-0.11.0-sidebars.json
│   │   ├── version-0.11.1-sidebars.json
│   │   ├── version-0.12.0-sidebars.json
│   │   ├── version-0.13.0-sidebars.json
│   │   ├── version-0.13.1-sidebars.json
│   │   ├── version-0.14.0-sidebars.json
│   │   ├── version-0.15.0-sidebars.json
│   │   └── version-0.9.1-sidebars.json
│   └── versions.json
├── Justfile
├── LICENSE
├── LLM_DISCLOSURE.md
├── NOTICE
├── packaging
│   ├── docker
│   │   └── Dockerfile
│   ├── maintainer-scripts
│   │   ├── postinst
│   │   └── postrm
│   ├── package-signing
│   │   └── snakeway-release-key.pub
│   └── systemd
│       └── snakeway.service
└── README.md

152 directories, 623 files
```