/**
 * CropperJS 2.x TypeScript definitions
 * These types represent the web component APIs from CropperJS 2.x
 */

/**
 * Cropper selection bounds
 */
export interface CropperBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Cropper transformation data
 */
export interface CropperTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
}

/**
 * Cropper canvas element properties
 */
export interface CropperCanvasElement extends HTMLElement {
  src?: string;
  alt?: string;
  background?: boolean;
  rotatable?: boolean;
  scalable?: boolean;
  skewable?: boolean;
  translatable?: boolean;

  // Methods
  getCropperImage(): CropperImageElement | null;
  setCropperImage(image: CropperImageElement): void;
}

/**
 * Cropper image element
 */
export interface CropperImageElement extends HTMLImageElement {
  transform?: Partial<CropperTransform>;
}

/**
 * Cropper selection element properties
 * Based on CropperJS 2.x actual API
 */
export interface CropperSelectionElement extends HTMLElement {
  // Properties (direct access)
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
  initialAspectRatio: number;
  initialCoverage: number;
  active: boolean;
  linked: boolean;
  dynamic: boolean;
  movable: boolean;
  resizable: boolean;
  zoomable: boolean;
  multiple: boolean;
  keyboard: boolean;
  outlined: boolean;
  precise: boolean;

  // Methods (prefixed with $)
  $center(): CropperSelectionElement;
  $move(x: number, y?: number): CropperSelectionElement;
  $moveTo(x: number, y?: number): CropperSelectionElement;
  $resize(action: string, offsetX?: number, offsetY?: number, aspectRatio?: number): CropperSelectionElement;
  $zoom(scale: number, x?: number, y?: number): CropperSelectionElement;
  $change(x: number, y: number, width?: number, height?: number, aspectRatio?: number): CropperSelectionElement;
  $reset(): CropperSelectionElement;
  $clear(): CropperSelectionElement;
}

/**
 * Cropper event detail
 */
export interface CropperEventDetail {
  action?: string;
  bounds?: CropperBounds;
  transform?: CropperTransform;
}

/**
 * Custom cropper event
 */
export interface CropperEvent extends CustomEvent<CropperEventDetail> {
  readonly detail: CropperEventDetail;
}

/**
 * Event handler types
 */
export type CropperEventHandler = (event: CropperEvent) => void;

declare global {
  interface HTMLElementTagNameMap {
    'cropper-canvas': CropperCanvasElement;
    'cropper-selection': CropperSelectionElement;
  }
}
