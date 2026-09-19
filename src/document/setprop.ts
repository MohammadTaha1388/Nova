// NOVA document - undoable property-set commands with drag coalescing.
import type { Command } from '../core/command-types.ts';
import type { NovaDocument, Layer } from '../project/types.ts';
import { findLayer } from './ops.ts';

export function makeSetProp(doc: NovaDocument, id: string, key: string, value: any): Command {
  const layer = findLayer(doc, id);
  if (!layer) throw new Error('NOVA_E_LAYER_NOT_FOUND');
  const target = layer as any;
  const before = target[key];
  return {
    id: 'set:' + id + ':' + key,
    label: 'Set ' + key,
    mergeKey: 'set:' + id + ':' + key,
    execute: () => { target[key] = value; },
    undo: () => { target[key] = before; },
    mergeInto: (next: Command) => {
      // Coalesced drag: apply the newer value while keeping the FIRST undo value.
      if (next.mergeKey === mergeKeyOf(cmd)) next.execute();
    },
  };
}
