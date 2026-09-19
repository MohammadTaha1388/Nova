// Tests: CommandStack undo/redo/merging.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CommandStack } from '../src/core/commands.ts';

const mk = (n: string, log: string[], key?: string) => ({
  id: n, label: n, mergeKey: key,
  execute: () => { log.push('+' + n); },
  undo: () => { log.push('-' + n); },
  mergeInto: (next: any) => { next.execute(); },
});

test('execute and undo/redo restore state', () => {
  const log: string[] = [];
  const s = new CommandStack();
  s.execute(mk('a', log));
  s.execute(mk('b', log));
  assert.deepEqual(log, ['+a', '+b']);
  s.undo();
  s.undo();
  assert.deepEqual(log, ['+a', '+b', '-b', '-a']);
  s.redo();
  assert.deepEqual(log, ['+a', '+b', '-b', '-a', '+a']);
});

test('new action clears redo branch', () => {
  const log: string[] = [];
  const s = new CommandStack();
  s.execute(mk('a', log));
  s.undo();
  s.execute(mk('b', log));
  assert.equal(s.canRedo, false);
});

test('same mergeKey coalesces into one step', () => {
  const log: string[] = [];
  const s = new CommandStack();
  s.execute(mk('op', log, 'drag'));
  s.execute(mk('op', log, 'drag'));
  s.execute(mk('op', log, 'drag'));
  s.undo();
  assert.deepEqual(log, ['+op', '+op', '+op', '-op']);
});
