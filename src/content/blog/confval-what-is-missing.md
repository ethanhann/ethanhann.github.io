---
title: "Confval: What's Missing"
date: 2026-08-25
description: A list of future enhancements for confval.
ogImage: ../../assets/blog/introducing_confval/confval_og_image.png
ogImageAlt: confval logo
---

This list of future enhancements for [confval](https://ethanhann.com/confval/) post-v0.9.0 is roughly in order of usefulness.
The list is nonexhaustive and captures what is on my mind after releasing v0.9.0.

## 1. Additional validation constraints

Constraints (i.e., range and keywords) have been intentionally minimal thus far.
However, there is a short list of additional constraints that would be broadly useful: `non_empty`, `length`, `format`, and `unique`.

| # | Constraint | Description                                                                          | Error Message                                                                                       |
|---|------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| 1 | non_empty  | Rejects an empty string, a whitespace-only string, or an empty list.                 | `{field} must not be empty`                                                                         |
| 2 | length     | Bounds the character count of a string, inclusive (the way `range` bounds a number). | `{field} must be at most {max} characters` or `{field} must be at least {min} characters`           |
| 3 | format     | Parses a string as a typed value and rejects the string when the parse fails.        | `{field} is not a valid {format}: {value}`                                                          |
| 4 | unique     | Rejects a list that repeats an element.                                              | It reports the second occurrence at its own span and points back to the first with a related label. |

## 2. LSP handlers

There are four additional handlers that would be useful and make LSP support feel more complete: `rename`, `document highlight`, `formatting`, and `folding ranges`.

| Handler            | LSP method                                             | What it does                                                                                                                                                                  |
|--------------------|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Rename             | `textDocument/rename` and `textDocument/prepareRename` | When the cursor is on a label or a reference value, rename updates the label and every reference that resolves to it in one edit.                                             |
| Document highlight | `textDocument/documentHighlight`                       | When the cursor is on a label or a reference value, highlight every related occurrence in the same document.                                                                  |
| Formatting         | `textDocument/formatting`                              | Formats the document by parsing it and emitting it back in canonical form. The emitter normalizes field order (values before blocks at each level), indentation, and quoting. |
| Folding ranges     | `textDocument/foldingRange`                            | Each block in the parsed tree becomes a foldable region.                                                                                                                      |

For reference, this is what was already implemented through v0.9.0:

| Handler          | LSP method                        | What it does                                                                            |
|------------------|-----------------------------------|-----------------------------------------------------------------------------------------|
| Completion       | `textDocument/completion`         | Provides auto-completion suggestions for field names, values, and keywords.             |
| Hover            | `textDocument/hover`              | Displays documentation and type information when hovering over a field or value.        |
| Diagnostics      | `textDocument/publishDiagnostics` | Reports validation errors, warnings, and other issues in the configuration file.        |
| Code action      | `textDocument/codeAction`         | Offers quick fixes and refactoring actions for diagnostics and other code improvements. |
| Go-to-definition | `textDocument/definition`         | Jumps to the definition of a label when clicking on a reference.                        |
| Find-references  | `textDocument/references`         | Finds all locations where a label is referenced throughout the configuration.           |
| Document symbols | `textDocument/documentSymbol`     | Provides an outline view of all blocks and fields in the document for easy navigation.  |
| Document links   | `textDocument/documentLink`       | Creates clickable links for file paths and URLs in the configuration.                   |

## 3. Format conversion CLI command

A command *could* be created that converts one or more files between different formats (i.e., TOML, HCL, KDL, JSON, YAML).

I am hesitant to implement this.
Conversion is supported by confval's format-neutral field model, but it may or may not be useful.
It also is only tangentially related to the crate's core goals.

The biggest challenge, and why it may not be entirely useful, is that confval does not preserve the order of fields in the configuration file.
This is where it might turn into a rabbit hole if that trade-off is not accepted.
