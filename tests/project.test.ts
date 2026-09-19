// Tests: .nova serialization, checksum, migration, corruption rejection.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { serialize, fnv1a, canonicalStringify } from '../src/project/serialize.ts';
import { deserialize } from '../src/project/load.ts';
import { SCHEMA_VERSION } from '../src/project/types.ts';

const proj = () => ({
  schemaVersion: SCHEMA_VERSION, appVersion: '0.1.0',
  document: {
    id: 'doc1', name: 'T', width: 100, height: 80, dpi: 96,
    background: '#fff', layers: [],
  },
  assets: {}, metadata: { createdAt: 't', modifiedAt: 't' },
});

test('roundtrip preserves payload', () => {
  const p = proj();
  const back = deserialize(serialize(p));
  assert.equal(back.document.name, 'T');
  assert.equal(back.document.width, 100);
});

test('checksum detects corruption', () => {
  const raw = serialize(proj());
  const broken = raw.replace('100', '999');
  assert.throws(() => deserialize(broken), /NOVA_E_CHECKSUM/);
});

test('migrates legacy v0 project', () => {
  const legacy = JSON.stringify({ document: { name: 'old' } });
  const p = deserialize(legacy);
  assert.equal(p.schemaVersion, 1);
  assert.equal(p.document.name, 'old');
});

test('rejects future versions', () => {
  const env = JSON.parse(serialize(proj()));
  env.schemaVersion = 99;
  assert.throws(() => deserialize(JSON.stringify(env)), /NOVA_E_FUTURE_VERSION/);
});

test('fnv1a deterministic', () => {
  assert.equal(fnv1a('nova'), fnv1a('nova'));
  assert.notEqual(fnv1a('nova'), fnv1a('nova '));
});

test('canonicalStringify sorts keys', () => {
  assert.equal(canonicalStringify({ b: 1, a: 2 }), '{"a":2,"b":1}');
});
