import { useCallback, type CSSProperties, type JSX } from 'react';
import {
  useCropperAdvanced,
  type UseCropperAdvancedOptions,
} from './useCropperAdvanced';
import type { CropperBounds } from '../types';

/**
 * Configuration options for useCropper hook
 */
export interface UseCropperOptions
  extends Omit<UseCropperAdvancedOptions, 'autoInitialize'> {
  /** Image source URL */
  src: string;
  /** Image alt text */
  alt?: string;
  /** CORS setting for the image */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /** Aspect ratio for the selection */
  aspectRatio?: number;
  /** Initial aspect ratio */
  initialAspectRatio?: number;
  /** Initial coverage (0-1) */
  initialCoverage?: number;
  /** Enable background */
  background?: boolean;
  /** Enable rotation */
  rotatable?: boolean;
  /** Enable scaling */
  scalable?: boolean;
  /** Enable skewing */
  skewable?: boolean;
  /** Enable translation */
  translatable?: boolean;
  /** Enable movable selection */
  movable?: boolean;
  /** Enable resizable selection */
  resizable?: boolean;
  /** Enable zoomable selection */
  zoomable?: boolean;
  /** Enable multiple selections */
  multiple?: boolean;
  /** Show selection outline */
  outlined?: boolean;
}

/**
 * Options for getting the cropped canvas
 */
export interface GetCroppedCanvasOptions {
  /** Width of the output canvas */
  width?: number;
  /** Height of the output canvas */
  height?: number;
  /** Callback before drawing the image onto the canvas */
  beforeDraw?: (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => void;
}

/**
 * Return type for useCropper hook
 */
export interface UseCropperReturn {
  /** Render the complete cropper UI */
  renderCropper: (props?: {
    className?: string;
    style?: CSSProperties;
  }) => JSX.Element;
  /** Current crop bounds */
  bounds: CropperBounds | null;
  /** Whether the cropper is ready */
  isReady: boolean;
  /** Get current bounds */
  getBounds: () => CropperBounds | null;
  /** Set crop bounds */
  setBounds: (bounds: Partial<CropperBounds>) => void;
  /** Reset cropper to initial state */
  reset: () => void;
  /** Clear the selection */
  clear: () => void;
  /** Get the cropped area as a canvas element */
  getCroppedCanvas: (
    options?: GetCroppedCanvasOptions
  ) => Promise<HTMLCanvasElement | null>;
}

/**
 * React hook for managing CropperJS 2.x with a simplified API
 *
 * Provides a simple, declarative API that handles all the complexity of
 * CropperJS web components internally. Just call renderCropper() to get
 * a fully functional image cropper.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const cropper = useCropper({
 *     src: '/image.jpg',
 *     alt: 'My image',
 *     aspectRatio: 16 / 9,
 *     onReady: () => console.log('Ready!'),
 *     onChange: (e) => console.log('Changed:', e.detail),
 *   });
 *
 *   return (
 *     <div>
 *       {cropper.renderCropper({ style: { maxHeight: '400px' } })}
 *       <button onClick={cropper.reset}>Reset</button>
 *       <button onClick={cropper.clear}>Clear</button>
 *       {cropper.bounds && <pre>{JSON.stringify(cropper.bounds)}</pre>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCropper(options: UseCropperOptions): UseCropperReturn {
  const {
    src,
    alt = '',
    crossOrigin,
    aspectRatio,
    initialAspectRatio,
    initialCoverage = 0.8,
    background = true,
    rotatable = true,
    scalable = true,
    skewable = true,
    translatable = true,
    movable = true,
    resizable = true,
    zoomable = true,
    multiple = false,
    outlined = true,
    ...advancedOptions
  } = options;

  const {
    canvasRef,
    selectionRef,
    bounds,
    isReady,
    getBounds,
    setBounds,
    reset,
    clear,
    getCroppedCanvas,
  } = useCropperAdvanced({
    ...advancedOptions,
    autoInitialize: true,
  });

  const renderCropper = useCallback(
    (props?: { className?: string; style?: CSSProperties }): JSX.Element => {
      const { className, style } = props ?? {};

      return (
        <cropper-canvas
          ref={canvasRef}
          class={className}
          style={style}
          background={background}
        >
          <cropper-image
            src={src}
            alt={alt}
            crossorigin={crossOrigin}
            rotatable={rotatable}
            scalable={scalable}
            skewable={skewable}
            translatable={translatable}
          />
          <cropper-selection
            ref={selectionRef}
            initial-coverage={initialCoverage}
            aspect-ratio={aspectRatio}
            initial-aspect-ratio={initialAspectRatio}
            movable={movable}
            resizable={resizable}
            zoomable={zoomable}
            multiple={multiple}
            outlined={outlined}
          >
            <cropper-grid role="grid" bordered covered />
            <cropper-crosshair centered />
            <cropper-handle
              action="move"
              theme-color="rgba(255, 255, 255, 0.35)"
            />
            <cropper-handle action="n-resize" />
            <cropper-handle action="e-resize" />
            <cropper-handle action="s-resize" />
            <cropper-handle action="w-resize" />
            <cropper-handle action="ne-resize" />
            <cropper-handle action="nw-resize" />
            <cropper-handle action="se-resize" />
            <cropper-handle action="sw-resize" />
          </cropper-selection>
        </cropper-canvas>
      );
    },
    [
      canvasRef,
      selectionRef,
      src,
      alt,
      crossOrigin,
      aspectRatio,
      initialAspectRatio,
      initialCoverage,
      background,
      rotatable,
      scalable,
      skewable,
      translatable,
      movable,
      resizable,
      zoomable,
      multiple,
      outlined,
    ]
  );

  return {
    renderCropper,
    bounds,
    isReady,
    getBounds,
    setBounds,
    reset,
    clear,
    getCroppedCanvas,
  };
}
