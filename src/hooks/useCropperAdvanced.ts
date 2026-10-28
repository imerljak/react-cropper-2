import { useRef, useCallback, useEffect, useState } from 'react';
import type {
  CropperCanvasElement,
  CropperSelectionElement,
  CropperBounds,
  CropperEventHandler,
  CropperImageElement,
  CropperSelectionChangeEvent,
  CropperCanvasActionStartEvent,
  CropperCanvasActionMoveEvent,
  CropperCanvasActionEndEvent,
  CropperImageTransformEvent,
  CropperShape,
  ExportOptions,
} from '../types';
import {
  applyExportEffects,
  canvasToBlob,
  resolveEncoding,
} from '../utils/canvas';

/**
 * Configuration options for useCropperAdvanced hook
 */
export interface UseCropperAdvancedOptions {
  /**
   * Callback when the cropper is ready.
   *
   * Fires once the selection has valid bounds *and* the image has a non-zero
   * layout box, so every element exposed by the hook is safe to measure here.
   */
  onReady?: (canvas: CropperCanvasElement) => void;
  /** Callback when crop area changes */
  onChange?: CropperEventHandler<CropperSelectionChangeEvent>;
  /** Callback when crop action starts */
  onCropStart?: CropperEventHandler<CropperCanvasActionStartEvent>;
  /** Callback when crop action moves */
  onCropMove?: CropperEventHandler<CropperCanvasActionMoveEvent>;
  /** Callback when crop action ends */
  onCropEnd?: CropperEventHandler<CropperCanvasActionEndEvent>;
  /** Calback when image transforms */
  onTransform?: CropperEventHandler<CropperImageTransformEvent>;
  /** Auto-initialize on mount */
  autoInitialize?: boolean;
  /**
   * Selection shape. `circle` masks exported images to a centred circle.
   *
   * This hook does not render anything, so it only affects exports; the
   * circular outline is drawn by `<Cropper />` and `useCropper`.
   */
  shape?: CropperShape;
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
 * Return type for useCropperAdvanced hook
 */
export interface UseCropperAdvancedReturn {
  /** Ref to attach to cropper-canvas element */
  canvasRef: React.RefObject<CropperCanvasElement | null>;
  /** Ref to attach to cropper-selection element */
  selectionRef: React.RefObject<CropperSelectionElement | null>;
  /** Ref to attach to cropper-image element */
  imageRef: React.RefObject<CropperImageElement | null>;
  /** Current crop bounds */
  bounds: CropperBounds | null;
  /** Whether the cropper is ready */
  isReady: boolean;
  /** Get current bounds */
  getBounds: () => CropperBounds | null;
  /** Set crop bounds */
  setBounds: (bounds: Partial<CropperBounds>) => void;
  /** Reset the cropper to its initial state: image transform and selection */
  reset: () => void;
  /** Reset only the selection, leaving the image transform untouched */
  resetSelection: () => void;
  /** Reset only the image transform (rotation, zoom, flip, translation) */
  resetTransform: () => void;
  /** Rotate the image by a relative angle, in degrees */
  rotate: (degrees: number) => void;
  /** Zoom by a relative ratio: positive zooms in, negative zooms out */
  zoom: (ratio: number) => void;
  /** Set the absolute zoom level, where 1 is the image's natural scale */
  setZoom: (level: number) => void;
  /** Mirror the image across the vertical axis */
  flipHorizontal: () => void;
  /** Mirror the image across the horizontal axis */
  flipVertical: () => void;
  /** Clear the selection */
  clear: () => void;
  /** Get canvas element */
  getCanvas: () => CropperCanvasElement | null;
  /** Get selection element */
  getSelection: () => CropperSelectionElement | null;
  /** Get the image element */
  getImage: () => CropperImageElement | null;
  /** Get the cropped area as a canvas element */
  getCroppedCanvas: (
    options?: GetCroppedCanvasOptions
  ) => Promise<HTMLCanvasElement | null>;
  /** Get the cropped area as an encoded Blob */
  getCroppedBlob: (
    options?: GetCroppedCanvasOptions & ExportOptions
  ) => Promise<Blob | null>;
  /** Get the cropped area as a File, ready for multipart upload */
  getCroppedFile: (
    filename: string,
    options?: GetCroppedCanvasOptions & ExportOptions
  ) => Promise<File | null>;
  /** Get the cropped area as a data URL */
  getCroppedDataURL: (
    options?: GetCroppedCanvasOptions & ExportOptions
  ) => Promise<string | null>;
}

/**
 * Advanced React hook for managing CropperJS 2.x web components
 *
 * Provides low-level access to cropper functionality for advanced use cases.
 * For most cases, use the simpler `useCropper` hook instead.
 *
 * @example
 * const { canvasRef, selectionRef, bounds, setBounds, reset } = useCropperAdvanced({
 *   onReady: (canvas) => console.log('Ready!'),
 *   onChange: (e) => console.log('Changed:', e.detail.bounds),
 * });
 *
 * // Then manually render cropper elements with refs attached
 */
export function useCropperAdvanced(
  options: UseCropperAdvancedOptions = {}
): UseCropperAdvancedReturn {
  const {
    onReady,
    onChange,
    onCropStart,
    onCropMove,
    onCropEnd,
    onTransform,
    autoInitialize = true,
    shape = 'rect',
  } = options;

  const canvasRef = useRef<CropperCanvasElement>(null);
  const selectionRef = useRef<CropperSelectionElement>(null);
  const imageRef = useRef<CropperImageElement>(null);
  const [bounds, setBoundsState] = useState<CropperBounds | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Store callbacks in refs to prevent stale closures
  const onReadyRef = useRef(onReady);
  const onChangeRef = useRef(onChange);
  const onCropStartRef = useRef(onCropStart);
  const onCropMoveRef = useRef(onCropMove);
  const onCropEndRef = useRef(onCropEnd);
  const onTransformRef = useRef(onTransform);

  // Update callback refs when they change
  useEffect(() => {
    onReadyRef.current = onReady;
    onChangeRef.current = onChange;
    onCropStartRef.current = onCropStart;
    onCropMoveRef.current = onCropMove;
    onCropEndRef.current = onCropEnd;
    onTransformRef.current = onTransform;
  });

  // Get current bounds from selection properties
  const getBounds = useCallback((): CropperBounds | null => {
    const selection = selectionRef.current;
    if (!selection) return null;

    try {
      return {
        x: selection.x,
        y: selection.y,
        width: selection.width,
        height: selection.height,
      };
    } catch {
      return null;
    }
  }, []);

  // Set bounds using $change method
  const setBounds = useCallback(
    (newBounds: Partial<CropperBounds>): void => {
      const selection = selectionRef.current;
      if (!selection) return;

      const currentBounds = getBounds();
      if (!currentBounds) return;

      const x = newBounds.x ?? currentBounds.x;
      const y = newBounds.y ?? currentBounds.y;
      const width = newBounds.width ?? currentBounds.width;
      const height = newBounds.height ?? currentBounds.height;

      selection.$change(x, y, width, height);

      // Update local state
      const updatedBounds = getBounds();
      if (updatedBounds) {
        setBoundsState(updatedBounds);
      }
    },
    [getBounds]
  );

  // Reset only the selection using $reset method
  const resetSelection = useCallback((): void => {
    const selection = selectionRef.current;
    if (!selection) return;

    selection.$reset();

    // Update local state
    const updatedBounds = getBounds();
    if (updatedBounds) {
      setBoundsState(updatedBounds);
    }
  }, [getBounds]);

  // Reset only the image transform using $resetTransform method
  const resetTransform = useCallback((): void => {
    imageRef.current?.$resetTransform();
  }, []);

  // CropperJS keeps the image transform on <cropper-image>, separate from the
  // selection's $initialSelection, so a full reset has to clear both.
  const reset = useCallback((): void => {
    resetTransform();
    resetSelection();
  }, [resetTransform, resetSelection]);

  // CropperJS reads a bare number as radians, so degrees are passed with an
  // explicit unit. Without it, rotate(90) would turn the image ~5157 degrees.
  const rotate = useCallback((degrees: number): void => {
    imageRef.current?.$rotate(`${String(degrees)}deg`);
  }, []);

  const zoom = useCallback((ratio: number): void => {
    imageRef.current?.$zoom(ratio);
  }, []);

  /**
   * Reads the uniform scale currently applied to the image.
   *
   * Derived from the matrix as hypot(a, b) so that it stays correct while the
   * image is rotated, where `a` alone is cos(angle) * scale rather than scale.
   */
  const getCurrentScale = useCallback((): number | null => {
    const image = imageRef.current;
    if (!image || typeof image.$getTransform !== 'function') return null;

    const [a, b] = image.$getTransform();
    const scale = Math.hypot(a, b);

    return scale > 0 ? scale : null;
  }, []);

  const setZoom = useCallback(
    (level: number): void => {
      const image = imageRef.current;
      if (!image || level <= 0) return;

      const currentScale = getCurrentScale();
      if (currentScale === null) return;

      // $scale multiplies the existing matrix, so convert the absolute target
      // into the relative factor that gets us there.
      image.$scale(level / currentScale);
    },
    [getCurrentScale]
  );

  const flipHorizontal = useCallback((): void => {
    imageRef.current?.$scale(-1, 1);
  }, []);

  const flipVertical = useCallback((): void => {
    imageRef.current?.$scale(1, -1);
  }, []);

  // Clear selection using $clear method
  const clear = useCallback((): void => {
    const selection = selectionRef.current;
    if (!selection) return;

    selection.$clear();
    setBoundsState(null);
  }, []);

  // Get canvas element
  const getCanvas = useCallback(
    (): CropperCanvasElement | null => canvasRef.current,
    []
  );

  // Get selection element
  const getSelection = useCallback(
    (): CropperSelectionElement | null => selectionRef.current,
    []
  );

  const getImage = useCallback(
    (): CropperImageElement | null => imageRef.current,
    []
  );

  // Get cropped canvas
  const getCroppedCanvas = useCallback(
    async (
      options?: GetCroppedCanvasOptions
    ): Promise<HTMLCanvasElement | null> => {
      const selection = selectionRef.current;
      if (!selection) return null;
      // Check if the $toCanvas method exists (web component might not be fully initialized)
      if (typeof selection.$toCanvas !== 'function') {
        console.warn('CropperJS selection element not fully initialized');
        return null;
      }
      return selection.$toCanvas(options);
    },
    []
  );

  /**
   * Crops, then applies shape masking and background fill.
   *
   * Shared starting point for every export helper so they cannot drift apart
   * in how they treat `shape` and `fillColor`.
   */
  const getProcessedCanvas = useCallback(
    async (
      options: GetCroppedCanvasOptions & ExportOptions = {}
    ): Promise<HTMLCanvasElement | null> => {
      const { mimeType, quality, fillColor, ...canvasOptions } = options;
      void quality; // Encoding-only; not used when drawing.

      const canvas = await getCroppedCanvas(canvasOptions);
      if (!canvas) return null;

      return applyExportEffects(
        canvas,
        { ...(mimeType && { mimeType }), ...(fillColor && { fillColor }) },
        shape
      );
    },
    [getCroppedCanvas, shape]
  );

  // Get the cropped area as an encoded Blob
  const getCroppedBlob = useCallback(
    async (
      options: GetCroppedCanvasOptions & ExportOptions = {}
    ): Promise<Blob | null> => {
      const canvas = await getProcessedCanvas(options);
      if (!canvas) return null;

      const { mimeType, quality } = resolveEncoding(options);
      return canvasToBlob(canvas, mimeType, quality);
    },
    [getProcessedCanvas]
  );

  // Get the cropped area as a File, ready for multipart upload
  const getCroppedFile = useCallback(
    async (
      filename: string,
      options: GetCroppedCanvasOptions & ExportOptions = {}
    ): Promise<File | null> => {
      const blob = await getCroppedBlob(options);
      if (!blob) return null;

      const { mimeType } = resolveEncoding(options);
      return new File([blob], filename, { type: mimeType });
    },
    [getCroppedBlob]
  );

  // Get the cropped area as a data URL
  const getCroppedDataURL = useCallback(
    async (
      options: GetCroppedCanvasOptions & ExportOptions = {}
    ): Promise<string | null> => {
      const canvas = await getProcessedCanvas(options);
      if (!canvas) return null;

      const { mimeType, quality } = resolveEncoding(options);
      return canvas.toDataURL(mimeType, quality);
    },
    [getProcessedCanvas]
  );

  // Track if refs are ready
  const [refsReady, setRefsReady] = useState(false);

  // Track ref population — no dep array so this runs after every render.
  // Handles two transitions:
  //   null → non-null: cropper mounted (including deferred/conditional render)
  //   non-null → null: cropper unmounted while the parent component stays mounted
  //     (e.g. {src && renderCropper()}). Without this, refsReady stays true,
  //     the listener setup never re-runs, and listeners end up on stale elements.
  useEffect(() => {
    if (!autoInitialize) return;

    const canvas = canvasRef.current;
    const selection = selectionRef.current;
    const image = imageRef.current;
    const allRefsPopulated = !!(canvas && selection && image);

    if (allRefsPopulated && !refsReady) {
      setRefsReady(true);
    } else if (!allRefsPopulated && refsReady) {
      setRefsReady(false);
    }
  });

  // Setup event listeners and initialization
  useEffect(() => {
    if (!autoInitialize || !refsReady) return;

    const canvas = canvasRef.current;
    const selection = selectionRef.current;
    const image = imageRef.current;

    if (!canvas || !selection || !image) return;

    // Wait for web component to be fully initialized
    // CropperJS web components need time to set up their methods
    let rafId: number | null = null;
    let cancelled = false;

    const checkReady = (): void => {
      if (cancelled) return;

      // The selection is sized from `initialCoverage`, which is measured
      // against the canvas — it can resolve before <cropper-image> has a
      // layout box. Gate on the image too, so that by the time onReady fires
      // every element it exposes is measurable.
      const imageBox = image.getBoundingClientRect();

      if (
        typeof selection.$toCanvas === 'function' &&
        selection.width > 0 &&
        selection.height > 0 &&
        imageBox.width > 0 &&
        imageBox.height > 0
      ) {
        // Web component is ready with valid selection
        setIsReady(true);
        if (onReadyRef.current) {
          onReadyRef.current(canvas);
        }
      } else {
        // Not ready yet, check again on next frame
        rafId = requestAnimationFrame(checkReady);
      }
    };

    checkReady();

    // Update bounds on change
    const handleChange: CropperEventHandler<CropperSelectionChangeEvent> = (
      event
    ) => {
      const newBounds = getBounds();
      if (newBounds) {
        setBoundsState(newBounds);
      }

      if (onChangeRef.current) {
        onChangeRef.current(event);
      }
    };

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
    addEventListener(selection, 'change', handleChange as EventListener);

    if (onCropStartRef.current) {
      addEventListener(
        selection,
        'cropstart',
        onCropStartRef.current as EventListener
      );
    }
    if (onCropMoveRef.current) {
      addEventListener(
        selection,
        'cropmove',
        onCropMoveRef.current as EventListener
      );
    }
    if (onCropEndRef.current) {
      addEventListener(
        selection,
        'cropend',
        onCropEndRef.current as EventListener
      );
    }
    if (onTransformRef.current) {
      addEventListener(
        image,
        'transform',
        onTransformRef.current as EventListener
      );
    }

    // Cleanup
    return () => {
      cancelled = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      handlers.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      setIsReady(false);
      setRefsReady(false);
    };
  }, [autoInitialize, refsReady, getBounds]);

  return {
    canvasRef,
    selectionRef,
    imageRef,
    bounds,
    isReady,
    getBounds,
    setBounds,
    reset,
    resetSelection,
    resetTransform,
    rotate,
    zoom,
    setZoom,
    flipHorizontal,
    flipVertical,
    clear,
    getCanvas,
    getSelection,
    getImage,
    getCroppedCanvas,
    getCroppedBlob,
    getCroppedFile,
    getCroppedDataURL,
  };
}
