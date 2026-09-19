// NOVA .nova format - schemaVersion 1 types.
export const SCHEMA_VERSION = 1;
export type LayerKind = 'image' | 'text' | 'shape' | 'group';

export interface Transform {
  x: number; y: number; scaleX: number; scaleY: number;
  rotation: number; flipH: boolean; flipV: boolean;
}
export interface Adjustments {
  brightness: number; contrast: number; saturation: number;
  temperature: number; tint: number; opacity: number;
}
export interface TextStyle {
  content: string; fontFamily: string; fontSize: number;
  weight: number; align: 'left' | 'center' | 'right'; color: string;
}
export interface ShapeStyle {
  type: 'rect' | 'ellipse' | 'line' | 'polygon';
  fill: string; stroke: string; strokeWidth: number;
  width: number; height: number; points?: number[];
}
export interface Layer {
  id: string; kind: LayerKind; name: string;
  visible: boolean; locked: boolean;
  transform: Transform; adjustments: Adjustments;
  children?: string[]; text?: TextStyle; shape?: ShapeStyle;
  assetRef?: string;
}
export interface Asset {
  id: string; hash: string; relPath: string; mime: string;
  width?: number; height?: number;
}
export interface NovaDocument {
  id: string; name: string; width: number; height: number;
  dpi: number; background: string; layers: Layer[];
}
export interface NovaProject {
  schemaVersion: number; appVersion: string;
  document: NovaDocument; assets: Record<string, Asset>;
  metadata: { createdAt: string; modifiedAt: string };
}
export interface NovaEnvelope {
  format: 'nova'; schemaVersion: number;
  checksum: string; payload: NovaProject;
}
