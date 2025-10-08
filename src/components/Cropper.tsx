import {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  type CSSProperties,
} from 'react';
import type {
  CropperCanvasElement,
  CropperSelectionElement,
  CropperEventHandler,
  CropperBounds,
} from '../types';

/**
 * Props for the Cropper component
 */
export interface CropperProps {
  /** Image source URL */
  src: string;
  /** Alt text for the image */
  alt?: string;
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
 * Methods exposed via ref
 */
export interface CropperRef {
  /** Get the canvas element */
  getCanvas: () => CropperCanvasElement | null;
  /** Get the selection element */
  getSelection: () => CropperSelectionElement | null;
  /** Get current crop bounds */
  getBounds: () => CropperBounds | null;
  /** Set crop bounds */
  setBounds: (bounds: Partial<CropperBounds>) => void;
  /** Reset cropper to initial state */
  reset: () => void;
  /** Clear the selection */
  clear: () => void;
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
    const canvasRef = useRef<CropperCanvasElement>(null);
    const selectionRef = useRef<CropperSelectionElement>(null);

    // Store callbacks in refs to prevent stale closures
    const onReadyRef = useRef(onReady);
    const onChangeRef = useRef(onChange);
    const onCropStartRef = useRef(onCropStart);
    const onCropMoveRef = useRef(onCropMove);
    const onCropEndRef = useRef(onCropEnd);

    // Update callback refs when they change
    useEffect(() => {
      onReadyRef.current = onReady;
      onChangeRef.current = onChange;
      onCropStartRef.current = onCropStart;
      onCropMoveRef.current = onCropMove;
      onCropEndRef.current = onCropEnd;
    });

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        getCanvas: () => canvasRef.current,
        getSelection: () => selectionRef.current,
        getBounds: () => {
          const selection = selectionRef.current;
          if (!selection) return null;
          return {
            x: selection.x,
            y: selection.y,
            width: selection.width,
            height: selection.height,
          };
        },
        setBounds: (bounds: Partial<CropperBounds>) => {
          const selection = selectionRef.current;
          if (!selection) return;

          const x = bounds.x ?? selection.x;
          const y = bounds.y ?? selection.y;
          const width = bounds.width ?? selection.width;
          const height = bounds.height ?? selection.height;

          selection.$change(x, y, width, height);
        },
        reset: () => {
          selectionRef.current?.$reset();
        },
        clear: () => {
          selectionRef.current?.$clear();
        },
      }),
      []
    );

    // Setup event listeners
    useEffect(() => {
      const canvas = canvasRef.current;
      const selection = selectionRef.current;

      if (!canvas || !selection) return;

      // Call onReady when component is mounted
      if (onReadyRef.current) {
        onReadyRef.current(canvas);
      }

      // Event listener helpers
      const handlers: Array<{
        element: HTMLElement;
        event: string;
        handler: EventListener;
      }> = [];

      const addEventListener = (
        element: HTMLElement,
        event: string,
        handler: EventListener
      ): void => {
        element.addEventListener(event, handler);
        handlers.push({ element, event, handler });
      };

      // Attach event listeners
      if (onChangeRef.current) {
        addEventListener(selection, 'change', onChangeRef.current as EventListener);
      }
      if (onCropStartRef.current) {
        addEventListener(selection, 'cropstart', onCropStartRef.current as EventListener);
      }
      if (onCropMoveRef.current) {
        addEventListener(selection, 'cropmove', onCropMoveRef.current as EventListener);
      }
      if (onCropEndRef.current) {
        addEventListener(selection, 'cropend', onCropEndRef.current as EventListener);
      }

      // Cleanup
      return () => {
        handlers.forEach(({ element, event, handler }) => {
          element.removeEventListener(event, handler);
        });
      };
    }, []); // Empty deps - refs are stable and handlers are attached once

    return (
      <cropper-canvas
        ref={canvasRef}
        class={className}
        style={style}
        background={background}
        rotatable={rotatable}
        scalable={scalable}
        skewable={skewable}
        translatable={translatable}
      >
        <img src={src} alt={alt} />
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
        />
      </cropper-canvas>
    );
  }
);

Cropper.displayName = 'Cropper';
