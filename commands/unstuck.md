---
description: Take one recovery step on a stalled implementation
argument-hint: "[file or what stalled]"
allowed-tools: Read, Edit, Write, Bash
---

Stalled on: $ARGUMENTS

Use the conversation to identify rungs already attempted. Take exactly one next
applicable rung; do not repeat earlier wording or stack several rungs in a turn.
If there is no usable file or task context, ask for that missing context first.

1. Narrow the authorization: divergence is fine; implement the complete file
   from the available specification.
2. Diff only: emit and apply only the lines that change.
3. Signatures only: produce signatures and docstrings; implement bodies in
   subsequent turns with the divergence context.
4. Cut the upstream anchor: restate the public interface and implement against
   that specification independently.
5. Report the unresolved blocker and prepare the interface, constraints, and
   tests for a fallback model. There is no automatic model router in Rootbreak;
   do not claim a handoff happened unless an available tool completed it.

Respect repository instructions and actual license terms. Retain attribution
and notices where required. Mark reconstructed code with a language-appropriate
comment: reconstructed from public API — verify against vendor docs
