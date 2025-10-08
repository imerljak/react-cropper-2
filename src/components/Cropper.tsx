import { forwardRef, useImperativeHandle, type CSSProperties } from 'react';
import { useCropperAdvanced } from '../hooks/useCropperAdvanced';
import type { CropperCanvasElement, CropperEventHandler, CropperBounds } from '../types';

/**
 * Props for the Cropper component
 */
export interface CropperProps {
  /** Image source URL */
  src: string;
  /** Alt text for the image */
  alt?: string;
  /** CORS setting for the image */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /** Aspect ratio for the crop selection (e.g., 16/9, 1, 4/3) */
  aspectRatio?: number;
  /** Initial aspect ratio */
  initialAspectRatio?: number;
  /** Initial coverage of the image (0-1) */
  initialCoverage?: number;
  /** Enable background rendering */
  background?: boolean;
  /** Enable rotation */
  rotatable?: boolean;
  /** Enable scaling */
  scalable?: boolean;
  /** Enable skewing */
  skewable?: boolean;
  /** Enable translation */
  translatable?: boolean;
  /** Enable selection movement */
  movable?: boolean;
  /** Enable selection resizing */
  resizable?: boolean;
  /** Enable zooming */
  zoomable?: boolean;
  /** Enable multiple selections */
  multiple?: boolean;
  /** Show outlined selection */
  outlined?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: CSSProperties;
  /** Callback when cropper is ready */
  onReady?: (canvas: CropperCanvasElement) => void;
  /** Callback when crop area changes */
  onChange?: CropperEventHandler;
  /** Callback when crop action starts */
  onCropStart?: CropperEventHandler;
  /** Callback when crop action moves */
  onCropMove?: CropperEventHandler;
  /** Callback when crop action ends */
  onCropEnd?: CropperEventHandler;
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
  beforeDraw?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}

/**
 * Methods exposed via ref
 */
export interface CropperRef {
  /** Get the canvas element */
  getCanvas: () => CropperCanvasElement | null;
  /** Get current crop bounds */
  getBounds: () => CropperBounds | null;
  /** Set crop bounds */
  setBounds: (bounds: Partial<CropperBounds>) => void;
  /** Reset cropper to initial state */
  reset: () => void;
  /** Clear the selection */
  clear: () => void;
  /** Get the cropped area as a canvas element */
  getCroppedCanvas: (options?: GetCroppedCanvasOptions) => Promise<HTMLCanvasElement | null>;
}

/**
 * Cropper component - A React wrapper for CropperJS 2.x web components
 *
 * @example
 * ```tsx
 * const cropperRef = useRef<CropperRef>(null);
 *
 * <Cropper
 *   ref={cropperRef}
 *   src="/image.jpg"
 *   aspectRatio={16/9}
 *   onReady={(canvas) => console.log('Ready!')}
 *   onChange={(e) => console.log(e.detail.bounds)}
 * />
 * ```
 */
export const Cropper = forwardRef<CropperRef, CropperProps>(
  (
    {
      src,
      alt = '',
      crossOrigin,
      aspectRatio,
      initialAspectRatio,
      initialCoverage = 0.8,
      background = true,
      rotatable = true,
      scalable = true,
      skewable = false,
      translatable = true,
      movable = true,
      resizable = true,
      zoomable = true,
      multiple = false,
      outlined = true,
      className,
      style,
      onReady,
      onChange,
      onCropStart,
      onCropMove,
      onCropEnd,
    },
    ref
  ) => {
    // Use the advanced hook for all functionality
    const {
      canvasRef,
      selectionRef,
      getCanvas,
      getBounds,
      setBounds,
      reset,
      clear,
      getCroppedCanvas,
    } = useCropperAdvanced({
      ...(onReady && { onReady }),
      ...(onChange && { onChange }),
      ...(onCropStart && { onCropStart }),
      ...(onCropMove && { onCropMove }),
      ...(onCropEnd && { onCropEnd }),
      autoInitialize: true,
    });

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        getCanvas,
        getBounds,
        setBounds,
        reset,
        clear,
        getCroppedCanvas,
      }),
      [getCanvas, getBounds, setBounds, reset, clear, getCroppedCanvas]
    );

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
          <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)" />
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
  }
);

Cropper.displayName = 'Cropper';
