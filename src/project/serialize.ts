// NOVA .nova format - canonical serialization + integrity checksum.
import { SCHEMA_VERSION } from './types.ts';
import type { NovaEnvelope, NovaProject } from './types.ts';

export function canonicalStringify(value: unknown): string {
  const walk = (v: any): any => {
    if (v === null || typeof v !== 'object') return v;
    if (Array.isArray(v)) return v.map(walk);
    const out: Record<string, any> = {};
    for (const k of Object.keys(v).sort()) out[k] = walk(v[k]);
    return out;
  };
  return JSON.stringify(walk(value));
}

export function fnv1a(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export function serialize(project: NovaProject): string {
  const json = canonicalStringify(project);
  const env: NovaEnvelope = {
    format: 'nova', schemaVersion: SCHEMA_VERSION,
    checksum: fnv1a(json), payload: project,
  };
  return JSON.stringify(env, null, 2);
}
