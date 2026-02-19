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
} from '../types';

/**
 * Configuration options for useCropperAdvanced hook
 */
export interface UseCropperAdvancedOptions {
  /** Callback when cropper is ready */
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
  /** Reset cropper to initial state */
  reset: () => void;
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

  // Reset cropper using $reset method
  const reset = useCallback((): void => {
    const selection = selectionRef.current;
    if (!selection) return;

    selection.$reset();

    // Update local state
    const updatedBounds = getBounds();
    if (updatedBounds) {
      setBoundsState(updatedBounds);
    }
  }, [getBounds]);

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

  // Track if refs are ready
  const [refsReady, setRefsReady] = useState(false);

  // Check if refs are available
  useEffect(() => {
    if (!autoInitialize) return;

    const canvas = canvasRef.current;
    const selection = selectionRef.current;
    const image = imageRef.current;

    if (canvas && selection && image && !refsReady) {
      setRefsReady(true);
    }
  }, [autoInitialize, refsReady]);

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

      // Check if web component methods exist AND selection has valid bounds
      if (
        typeof selection.$toCanvas === 'function' &&
        selection.width > 0 &&
        selection.height > 0
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
    clear,
    getCanvas,
    getSelection,
    getImage,
    getCroppedCanvas,
  };
}
