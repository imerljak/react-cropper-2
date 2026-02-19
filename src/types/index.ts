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

export interface CropperElement {
  shadowRootMode?: 'closed' | 'open' | undefined;
  slottable?: boolean | undefined;
  themeColor?: string | undefined;
}

/**
 * Cropper canvas element properties
 */
export interface CropperCanvasElement extends CropperElement, HTMLElement {
  background?: boolean;
  disabled?: boolean;
  scaleStep?: number;
  themeColor?: string;

  // Methods
  $setAction(action: string): CropperCanvasElement;
  $toCanvas(options?: {
    width?: number;
    height?: number;
    beforeDraw?: (
      context: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement
    ) => void;
  }): Promise<HTMLCanvasElement>;
}

export type TransformMatrix = [number, number, number, number, number, number];
export type ImageSize = 'contain' | 'cover';

/**
 * Cropper image element
 */
export interface CropperImageElement extends CropperElement, HTMLImageElement {
  initialCenterSize?: ImageSize | undefined;
  rotatable?: boolean | undefined;

  $ready(
    callback?: (image: HTMLImageElement) => void
  ): Promise<HTMLImageElement>;
  $center: (
    size?: CropperImageElement['initialCenterSize']
  ) => CropperImageElement;
  $move(x: number, y?: number): CropperImageElement;
  $moveTo(x: number, y?: number): CropperImageElement;
  $rotate(angle: number | string, x?: number, y?: number): CropperImageElement;
  $zoom(scale: number, x?: number, y?: number): CropperImageElement;
  $scale(x: number, y?: number): CropperImageElement;
  $skew(x: number | string, y?: number | string): CropperImageElement;
  $translate(x: number, y?: number): CropperImageElement;
  $transform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): CropperImageElement;
  $setTransform(matrix: TransformMatrix): CropperImageElement;
  $setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): CropperImageElement;
  $getTransform(): TransformMatrix;
  $resetTransform(): CropperImageElement;
}

/**
 * Cropper selection element properties
 * Based on CropperJS 2.x actual API
 */
export interface CropperSelectionElement extends CropperElement, HTMLElement {
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
  $resize(
    action: string,
    offsetX?: number,
    offsetY?: number,
    aspectRatio?: number
  ): CropperSelectionElement;
  $zoom(scale: number, x?: number, y?: number): CropperSelectionElement;
  $change(
    x: number,
    y: number,
    width?: number,
    height?: number,
    aspectRatio?: number
  ): CropperSelectionElement;
  $reset(): CropperSelectionElement;
  $clear(): CropperSelectionElement;
  $toCanvas(options?: {
    width?: number;
    height?: number;
    beforeDraw?: (
      context: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement
    ) => void;
  }): Promise<HTMLCanvasElement>;
}

export interface CropperCanvasActionEvent extends CustomEvent {
  readonly detail: {
    readonly action: string;
    readonly relatedEvent: PointerEvent | TouchEvent | MouseEvent | WheelEvent;
    readonly scale: number;
    readonly rotate: number;
    readonly startX: number;
    readonly startY: number;
    readonly endX: number;
    readonly endY: number;
  };
}

export interface CropperCanvasActionStartEvent extends CustomEvent {
  readonly detail: {
    readonly action: string;
    readonly relatedEvent: PointerEvent | TouchEvent | MouseEvent;
  };
}

export interface CropperCanvasActionMoveEvent extends CustomEvent {
  readonly detail: {
    readonly action: string;
    readonly relatedEvent: PointerEvent | TouchEvent | MouseEvent;
  };
}

export interface CropperCanvasActionEndEvent extends CustomEvent {
  readonly detail: {
    readonly action: string;
    readonly relatedEvent: PointerEvent | TouchEvent | MouseEvent;
  };
}

export interface CropperImageTransformEvent extends CustomEvent {
  readonly detail: {
    readonly matrix: TransformMatrix;
    readonly oldMatrix: TransformMatrix;
  };
}

export interface CropperSelectionChangeEvent extends CustomEvent {
  readonly detail: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}

/**
 * Event handler types
 */
export type CropperEventHandler<T> = (event: T) => void;

declare global {
  interface HTMLElementTagNameMap {
    'cropper-canvas': CropperCanvasElement;
    'cropper-selection': CropperSelectionElement;
    'cropper-image': CropperImageElement;
  }
}
