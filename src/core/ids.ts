// NOVA Core - collision-resistant IDs. Zero dependencies.
let seq = 0;
export function createId(prefix = 'id'): string {
  const rnd = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  seq = (seq + 1) % 100000;
  return `${prefix}_${Date.now().toString(36)}_${rnd}_${seq}`;
}
