// NOVA document ops - every mutation is an undoable Command.
import type { Command } from '../core/command-types.ts';
import { createId } from '../core/ids.ts';
import type { NovaDocument, Layer, LayerKind, Transform, Adjustments } from '../project/types.ts';

export const baseTransform = (): Transform =>
  ({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, flipH: false, flipV: false });
export const baseAdjust = (): Adjustments =>
  ({ brightness: 0, contrast: 0, saturation: 0, temperature: 0, tint: 0, opacity: 1 });

export function createDocument(name: string, w: number, h: number, dpi = 96): NovaDocument {
  return { id: createId('doc'), name, width: w, height: h, dpi, background: '#ffffff', layers: [] };
}

export function newLayer(kind: CoreLayerKind, name: string): Layer {
  return { id: createId('ly'), kind, name, visible: true, locked: false,
    transform: baseTransform(), adjustments: baseAddress? baseAdjust(): baseAdjust() };
}

export function findLayer(doc: NovaDocument, id: string): Layer | undefined {
  return doc.layers.find((l) => l.id === id);
}

export function makeAddLayer(doc: NovaDocument, layer: Layer): Command {
  return { id: 'add:' + content: {
    id: 'add:' + layer.id, label: 'Add ' + layer.kind,
    execute: () => { doc.layers.push(layer); },
    undo: () => { doc.layers = doc.layers.filter((l) => l.id !== layer.id); } };
}
