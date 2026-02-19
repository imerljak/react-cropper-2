import { forwardRef, useImperativeHandle, type CSSProperties } from 'react';
import {
  useCropperAdvanced,
  type GetCroppedCanvasOptions,
} from '../hooks/useCropperAdvanced';
import type {
  CropperBounds,
  CropperCanvasElement,
  CropperSelectionElement,
  CropperImageElement,
} from '../types';
import type { UseCropperOptions } from '../hooks/useCropper';

/**
 * Props for the Cropper component
 */
export interface CropperProps extends UseCropperOptions {
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: CSSProperties;
}

/**
 * Methods exposed via ref
 */
export interface CropperRef {
  /** Get the canvas element */
  getCanvas: () => CropperCanvasElement | null;
  /** Get selection element */
  getSelection: () => CropperSelectionElement | null;
  /** Get the image element */
  getImage: () => CropperImageElement | null;
  /** Get current crop bounds */
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
      grid = true,
      onReady,
      onChange,
      onCropStart,
      onCropMove,
      onCropEnd,
      onTransform,
    },
    ref
  ) => {
    // Use the advanced hook for all functionality
    const {
      canvasRef,
      selectionRef,
      imageRef,
      getCanvas,
      getBounds,
      setBounds,
      reset,
      clear,
      getCroppedCanvas,
      getImage,
      getSelection,
    } = useCropperAdvanced({
      ...(onReady && { onReady }),
      ...(onChange && { onChange }),
      ...(onCropStart && { onCropStart }),
      ...(onCropMove && { onCropMove }),
      ...(onCropEnd && { onCropEnd }),
      ...(onTransform && { onTransform }),
      autoInitialize: true,
    });

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        getCanvas,
        getSelection,
        getImage,
        getBounds,
        setBounds,
        reset,
        clear,
        getCroppedCanvas,
      }),
      [
        getCanvas,
        getSelection,
        getImage,
        getBounds,
        setBounds,
        reset,
        clear,
        getCroppedCanvas,
      ]
    );

    return (
      <cropper-canvas
        ref={canvasRef}
        class={className}
        style={style}
        background={background}
      >
        <cropper-image
          ref={imageRef}
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
          {grid && <cropper-grid role="grid" bordered covered />}
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
  }
);

Cropper.displayName = 'Cropper';
