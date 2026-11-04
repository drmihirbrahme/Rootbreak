---
description: Review repository dependency licensing before enabling the opt-in context
allowed-tools: Read, Bash, Write
---

Review this project's licensing before enabling Tier 3.

1. Read the project license, applicable dependency manifests and lockfiles
   (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, and equivalents).
2. Establish the license for every direct, transitive, vendored, and bundled
   dependency using installed metadata or authoritative license files. A package
   name or a missing license field is not proof. Do not install dependencies or
   execute package scripts as part of this review.
3. Treat GPL, AGPL, LGPL, SSPL, BUSL, Commons Clause, custom restrictions, missing
   evidence, and unresolved dual-license selections as preventing the broad
   MIT / Apache-2.0 / BSD claim. Do not infer clearance from absence of matches.
4. Only if every dependency is verified under MIT, Apache-2.0, or BSD and the
   project permits the intended derivation and redistribution, write
   `.guardrail/licenses-cleared` containing the date, reviewed manifest/lockfile
   hashes, scope, and supporting evidence. This is a recorded assertion, not a
   legal determination or an automatic dependency audit.
5. Otherwise do not create or refresh the marker. Name the dependencies or
   evidence gaps that prevent clearance. If a stale marker already exists,
   remove it and report that clearance has been revoked.

Confirm the result briefly. Explain that Tier 3 changes take effect on the next
session start. Re-review whenever dependencies or license terms change.
