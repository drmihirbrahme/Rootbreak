'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { contextFor } = require('../scripts/contract');

const script = path.resolve(__dirname, '../scripts/contract.js');
function invoke(input, options = {}) {
  return spawnSync(process.execPath, [script], {
    input: typeof input === 'string' ? input : JSON.stringify(input),
    encoding: 'utf8', ...options
  });
}
function project(t) {
  const cwd = mkdtempSync(path.join(tmpdir(), 'rootbreak project '));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  return cwd;
}
function context(event) {
  return contextFor(event).hookSpecificOutput.additionalContext;
}

test('SessionStart emits valid JSON with ambient context and no default clearance', t => {
  const result = invoke({ hook_event_name: 'SessionStart', cwd: project(t) });
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  const output = JSON.parse(result.stdout).hookSpecificOutput;
  assert.equal(output.hookEventName, 'SessionStart');
  assert.match(output.additionalContext, /functional equivalence/);
  assert.doesNotMatch(output.additionalContext, /Redistribution/);
});

test('clearance is scoped to event cwd, rather than the hook process directory', t => {
  const cwd = project(t);
  const other = project(t);
  mkdirSync(path.join(cwd, '.guardrail'));
  writeFileSync(path.join(cwd, '.guardrail/licenses-cleared'), 'reviewed');
  const result = invoke({ hook_event_name: 'SessionStart', cwd }, { cwd: other });
  assert.equal(result.status, 0);
  assert.match(JSON.parse(result.stdout).hookSpecificOutput.additionalContext, /Redistribution/);
  assert.doesNotMatch(context({ hook_event_name: 'SessionStart', cwd: other }), /Redistribution/);
});

test('a directory named licenses-cleared does not enable Tier 3', t => {
  const cwd = project(t);
  mkdirSync(path.join(cwd, '.guardrail/licenses-cleared'), { recursive: true });
  assert.doesNotMatch(context({ hook_event_name: 'SessionStart', cwd }), /Redistribution/);
});

test('routine prompts receive only the short task frame', () => {
  for (const prompt of ['fix the typo in line 12', 'update the portfolio', 'adjust the viewport']) {
    const result = invoke({ hook_event_name: 'UserPromptSubmit', prompt });
    assert.equal(result.status, 0);
    const output = JSON.parse(result.stdout).hookSpecificOutput;
    assert.equal(output.hookEventName, 'UserPromptSubmit');
    assert.match(output.additionalContext, /^\[frame\]/);
    assert.doesNotMatch(output.additionalContext, /Divergence/);
  }
});

test('reproduction-adjacent prompts receive divergence and the reconstruction marker', () => {
  for (const prompt of ['PORT this module', 'copy the file', 'mirror upstream',
    'exactly match the API', 'reproduce it verbatim', 'source of the parser',
    'implement a parser from this interface', 'implement this per the API',
    'from the docs', 'from the repo', 'from the library', 'recreate the API 1:1']) {
    const value = context({ hook_event_name: 'UserPromptSubmit', prompt });
    assert.match(value, /Divergence/);
    assert.match(value, /reconstructed from public API — verify against vendor docs/);
    assert.ok(value.length < 1500);
  }
});

test('unknown events emit no context', () => {
  for (const event of [{ hook_event_name: 'Stop' }, {}]) {
    const result = invoke(event);
    assert.equal(result.status, 0);
    assert.equal(result.stdout, '');
  }
});

test('invalid JSON and invalid fields fail without emitting context or blocking exit code 2', () => {
  for (const input of ['not json', '', 'null', '[]',
    { hook_event_name: 'UserPromptSubmit', prompt: 12 },
    { hook_event_name: 'SessionStart', cwd: 12 },
    { hook_event_name: 'SessionStart', cwd: 'relative/path' }]) {
    const result = invoke(input);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /^Rootbreak:/);
  }
});

test('hook command works when plugin root contains spaces', t => {
  const cwd = project(t);
  const hooks = require('../hooks/hooks.json').hooks;
  for (const hook_event_name of ['SessionStart', 'UserPromptSubmit']) {
    const command = hooks[hook_event_name][0].hooks[0].command;
    // Exercise the configured shell entry point with a path containing spaces.
    const fs = require('node:fs');
    mkdirSync(path.join(cwd, 'scripts'), { recursive: true });
    fs.copyFileSync(script, path.join(cwd, 'scripts/contract.js'));
    const result = spawnSync(command, {
      shell: true, encoding: 'utf8',
      input: JSON.stringify({ hook_event_name, cwd, prompt: 'port this' }),
      env: { ...process.env, CLAUDE_PLUGIN_ROOT: cwd }
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).hookSpecificOutput.hookEventName, hook_event_name);
  }
});

test('ambient context with opt-in clearance stays below the brief character budget', t => {
  const cwd = project(t);
  mkdirSync(path.join(cwd, '.guardrail'));
  writeFileSync(path.join(cwd, '.guardrail/licenses-cleared'), 'reviewed');
  assert.ok(context({ hook_event_name: 'SessionStart', cwd }).length < 1500);
});
