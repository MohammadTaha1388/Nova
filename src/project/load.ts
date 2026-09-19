// NOVA .nova format - safe loading, migrations, future-version rejection.
import { SCHEMA_VERSION } from './types.ts';
import type { NovaProject } from './types.ts';
import { canonicalStringify, fnv1a } from './serialize.ts';

type Migration = (old: any) => NovaProject;
const MIGRATIONS: Record<number, Migration> = {
  0: (old) => ({
    schemaVersion: 1, appVersion: old?.appVersion ?? '0.1.0',
    document: old?.document ?? old,
    assets: old?.assets ?? {},
    metadata: old?.metadata ?? {
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    },
  }),
};

export function deserialize(raw: string): NovaProject {
  let p: any;
  try { p = JSON.parse(raw); }
  catch { throw new Error('NOVA_E_PARSE'); }
  const ver = p?.format === 'nova' ? p.schemaVersion : 0;
  if (typeof ver !== 'number' || !Number.isInteger(ver) || ver < 0) {
    throw new Error('NOVA_E_INVALID_VERSION');
  }
  if (ver > SCHEMA_VERSION) throw new Error('NOVA_E_FUTURE_VERSION');
  if (ver >= 1) {
    const ok = fnv1a(canonicalStringify(p.payload)) === p.checksum;
    if (!ok) throw new Error('NOVA_E_CHECKSUM_MISMATCH');
  }
  let cur: any = p?.format === 'nova' ? p.payload : p;
  for (let v = ver; v < SCHEMA_VERSION; v++) {
    const m = MIGRATIONS[v];
    if (!m) throw new Error('NOVA_E_NO_MIGRATION_' + v);
    cur = m(cur);
  }
  return cur as NovaProject;
}
