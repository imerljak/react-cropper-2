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
 */
export interface CropperSelectionElement extends HTMLElement {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  aspectRatio?: number;
  initialAspectRatio?: number;
  initialCoverage?: number;
  movable?: boolean;
  resizable?: boolean;
  zoomable?: boolean;
  multiple?: boolean;
  outlined?: boolean;

  // Methods
  getBounds(): CropperBounds;
  setBounds(bounds: Partial<CropperBounds>): void;
  reset(): void;
  clear(): void;
  change(event: Event): void;
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
