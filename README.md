# Rootbreak

A dependency-free Claude Code plugin that adds tiered implementation context
and a one-step recovery ladder for stalled coding work. Built from the supplied
Guardrail Bridge brief; the repository and command namespace are now Rootbreak.

## Quick start

Requires Node.js 22+ on `PATH` and Claude Code with plugin support.

```sh
git clone https://github.com/drmihirbrahme/Rootbreak.git
cd Rootbreak
npm test
claude plugin validate .
```

From the project you want to work on, launch Claude Code with the absolute path
to your clone:

```sh
claude --plugin-dir /absolute/path/to/Rootbreak
```

No `npm install`, build step, API key, or network service is needed by this plugin.
Private repository access requires authentication when cloning.

## Context tiers

| Tier | When | What it adds |
| --- | --- | --- |
| 0 | `SessionStart` | Maintainer framing and functional-equivalence target |
| 1 | Every `UserPromptSubmit` | Short specification-first frame |
| 2 | A matching reproduction-adjacent prompt | Divergence authorization and reconstruction marker |
| 3 | Session start with `.guardrail/licenses-cleared` in the target project | Explicit MIT / Apache-2.0 / BSD clearance assertion |

The trigger is a lightweight regex, not a copyright classifier. Ordinary words
such as “copy” and “port” can activate Tier 2. Each emitted context block is kept
below the brief's 1,500-character target; context can still accumulate over a
long conversation.

The payload requests tool use on implementation turns. Rootbreak does not
enforce that request, intercept stopping, or guarantee model compliance.
Existing project instructions and actual license requirements still apply.

## Commands

- `/rootbreak:clear-licenses` reviews the target project's dependency evidence
  before writing `.guardrail/licenses-cleared`. Unknown or incompatible terms
  prevent clearance. This is an agent-guided review, not a bundled license scanner.
- `/rootbreak:unstuck [file or blocker]` takes one recovery step: narrower
  authorization, diff, signatures, independent interface implementation, or a
  prepared fallback handoff. No fallback model router is included.

Tier 3 is disabled by default. Its marker is a human/agent assertion: the hook
checks that a file exists, not its evidence or freshness. Re-review after
dependency changes. To revoke it, delete the marker in the target repository:

```sh
rm -f .guardrail/licenses-cleared
```

Start a fresh session for changed session context. Keep the marker out of version
control in projects using this plugin; it should reflect that checkout's review.

## Reconstruction trace

Tier 2 and `/rootbreak:unstuck` request a language-appropriate comment containing:

```text
reconstructed from public API — verify against vendor docs
```

Find these files during review with:

```sh
rg -n 'reconstructed from public API' .
```

This is a prompt instruction, not an automatic file annotator. Test and review
generated implementations against the intended interface.

## Development and verification

```sh
npm run check
npm test
claude plugin validate .
```

Tests exercise the subprocess JSON protocol, both hook events, conditional
context, repository-scoped opt-in, malformed input, unsupported events, and
plugin paths containing spaces. GitHub Actions runs syntax checks and tests on
Node.js 22 and 24. No model calls or refusal-rate benchmarks are part of this suite.

`scripts/contract.js` reads one JSON event from stdin, emits hook JSON to stdout,
and sends diagnostics to stderr. Unsupported events produce no output. Malformed
input exits 1 without context; it does not use the prompt-blocking exit code 2.
The hook reads only the opt-in marker and never writes project files or sends
data over the network.

## Design and limits

The [design notes](docs/design.md) distinguish the supplied proposal from verified
behavior. Rootbreak supplies context; it does not change model policies, create
license rights, establish higher instruction priority, or guarantee correct code.
The brief's pass-rate and model-fallback claims have not been measured here.

Integration follows the official [plugin manifest reference](https://code.claude.com/docs/en/plugins-reference),
[plugin creation guide](https://code.claude.com/docs/en/plugins/create), and
[hook reference](https://code.claude.com/docs/en/hooks).

## License

MIT; see [LICENSE](LICENSE). This license covers Rootbreak's code and does not
assert clearance for dependencies or generated work in other repositories.
