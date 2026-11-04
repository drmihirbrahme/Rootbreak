# Design notes

The supplied brief proposed five mechanisms: specification framing, advance
authorization of implementation divergence, a request to use tools rather than
stop, opt-in license context, and declarative wording. Rootbreak implements these
as small context tiers instead of one large prompt.

## Implemented path

`hooks/hooks.json` invokes `scripts/contract.js` at session start and prompt
submission. The script returns `hookSpecificOutput` with the matching event name
and `additionalContext`. Only a reproduction-adjacent prompt gets Tier 2. A real
`.guardrail/licenses-cleared` file in the event's working directory enables Tier 3.

The two commands support an evidence-based license assertion and a single-rung
recovery workflow. The internal `.guardrail` marker path is retained from the
brief so the hook and command share the same opt-in contract.

## Differences from the sample

- Rename the plugin and slash-command namespace to `rootbreak`.
- Include the required reconstruction marker in conditional context.
- Reject malformed input instead of silently treating it as session start.
- Ignore unsupported hook events rather than injecting ambient context.
- Require absolute event paths and a file rather than a directory for clearance.
- Use Claude Code's `allowed-tools` command frontmatter spelling.
- Expand the license command to require evidence for transitive and vendored
  dependencies and to revoke stale clearance when a review cannot support it.
- Scope advance confirmation to implementation divergence.
- Document fallback handoff as manual preparation; the earlier router referenced
  in the brief was not supplied and is not implemented.

## Claims requiring measurement

No refusal-rate improvement or universal fallback success is established by the
unit tests. Specification framing does not determine whether a particular output
is licensed. A model may produce incorrect code without an obvious warning.
Hook context is delivered as a system reminder according to Claude Code's
documentation; that transport does not establish a right to override higher
priority instructions. Tool use and reconstruction comments remain requested
behaviors, not enforced invariants.

The opt-in file is intentionally simple and compatible with the supplied sample.
Its existence does not prove a complete or current license review. Projects must
revoke or refresh it as their dependency graph changes.
