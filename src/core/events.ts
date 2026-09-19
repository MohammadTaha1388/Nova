// NOVA Core - typed synchronous event bus. Zero dependencies.
export type Handler<T> = (p: T) => void;

export class EventBus {
  private m = new Map<string, Set<Handler<any>>>();
  on(t: string, h: Handler<any>): () => void {
    let s = this.m.get(t);
    if (!s) { s = new Set(); this.m.set(t, s); }
    s.add(h);
    return () => { s.delete(h); };
  }
  off(t: string, h: Handler<any>): void { this.m.get(t)?.delete(h); }
  once(t: string, h: Handler<any>): void {
    const w = (p: any) => { this.off(t, w); h(p); };
    this.on(t, w);
  }
  emit<T>(t: string, p: T): void {
    const s = this.m.get(t);
    if (!s) return;
    for (const h of [...s]) {
      try { (h as Handler<T>)(p); } catch (e) { console.error('[events]', t, e); }
    }
  }
}
