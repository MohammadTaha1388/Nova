// NOVA Core - CommandStack: THE undo/redo mechanism for the whole app.
import { EventBus } from './events.ts';
import type { Command, HistoryEvent } from './command-types.ts';

export class CommandStack {
  private done: Command[] = [];
  private undone: Command[] = [];
  readonly events = new EventBus();
  constructor(private readonly limit = 200) {}

  execute(cmd: Command): void {
    const prev = this.done[this.done.length - 1];
    if (prev && prev.mergeKey && prev.mergeKey === cmd.mergeKey && prev.mergeInto) {
      prev.mergeInto(cmd);
    } else {
      cmd.execute();
      this.done.push(cmd);
    }
    this.undone = [];
    if (this.done.length > this.limit) this.done.shift();
    this.emit();
  }
  undo(): void {
    const c = this.done.pop();
    if (!c) return;
    c.undo();
    this.undone.push(c);
    this.emit();
  }
  redo(): void {
    const c = this.undone.pop();
    if (!c) return;
    c.execute();
    this.done.push(c);
    this.emit();
  }
  get canUndo() { return this.done.length > 0; }
  get canRedo() { return this.undone.length > 0; }
  private emit(): void {
    this.events.emit<HistoryEvent>('history', {
      canUndo: this.canUndo, canRedo: this.canRedo, depth: this.done.length,
    });
  }
}
