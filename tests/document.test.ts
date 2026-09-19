// Tests: layer commands and undo/redo across document mutations.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CommandStack } from '../src/core/commands.ts';
import { createDocument, newLayer, makeAddLayer, makeDeleteLayer } from '../src/document/ops.ts';
import { makeSetProp } from '../src/document/setprop.ts';

test('add layer undo redo', () => {
  const doc = createDocument('d', 100, 100);
  const s = new CommandStack();
  const l = newLayer('shape', 'bg');
  s.execute(makeAddLayer(doc, l));
  assert.equal(doc.layers.length, 1);
  s.undo();
  assert.equal(doc.layers.length, 0);
  s.redo();
  assert.equal(doc.layers[0].id, l.id);
});

test('delete layer restores on undo', () => {
  const doc = createDocument('d', 100, 100);
  const s = new CommandStack();
  s.execute(makeAddLayer(doc, newLayer('shape', 'a')));
  const b = newLayer('shape', 'b');
  s.execute(makeAddLayer(doc, b));
  s.execute(makeDeleteLayer(doc, b.id));
  assert.equal(doc.layers.length, 1);
  s.undo();
  assert.equal(doc.layers[1].id, b.id);
});

test('setprop coalesces drag into one undo', () => {
  const doc = createDocument('d', 100, 100);
  const s = new CommandStack();
  s.execute(makeAddLayer(doc, newLayer('shape', 'a')));
  const id = doc.layers[0].id;
  s.execute(makeSetProp(doc, id, 'name', 'x'));
  s.execute(makeSetProp(doc, id, 'name', 'y'));
  assert.equal(doc.layers[0].name, 'y');
  s.undo();
  assert.equal(doc.layers[0].name, 'a');
});
