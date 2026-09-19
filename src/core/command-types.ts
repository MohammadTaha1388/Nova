// NOVA Core - command contract. ALL edits flow through this.
export interface Command {
  readonly id: string;
  readonly label: string;
  execute(): void;
  undo(): void;
  mergeKey?: string;
  mergeInto?(next: Command): void;
}

export interface HistoryEvent {
  canUndo: boolean;
  canRedo: boolean;
  depth: number;
}
