import { useRef, useCallback, useEffect, useState } from 'react';
import type {
  CropperCanvasElement,
  CropperSelectionElement,
  CropperBounds,
  CropperEventHandler,
} from '../types';

/**
 * Configuration options for useCropper hook
 */
export interface UseCropperOptions {
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
  /** Auto-initialize on mount */
  autoInitialize?: boolean;
}

/**
 * Return type for useCropper hook
 */
export interface UseCropperReturn {
  /** Ref to attach to cropper-canvas element */
  canvasRef: React.RefObject<CropperCanvasElement>;
  /** Ref to attach to cropper-selection element */
  selectionRef: React.RefObject<CropperSelectionElement>;
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
}

/**
 * React hook for managing CropperJS 2.x web components
 *
 * Provides a composable API for cropper functionality with automatic
 * event handling, state management, and cleanup.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { canvasRef, selectionRef, bounds, setBounds, reset } = useCropper({
 *     onReady: (canvas) => console.log('Ready!'),
 *     onChange: (e) => console.log('Changed:', e.detail.bounds),
 *   });
 *
 *   return (
 *     <cropper-canvas ref={canvasRef}>
 *       <img src="/image.jpg" />
 *       <cropper-selection ref={selectionRef} />
 *     </cropper-canvas>
 *   );
 * }
 * ```
 */
export function useCropper(options: UseCropperOptions = {}): UseCropperReturn {
  const {
    onReady,
    onChange,
    onCropStart,
    onCropMove,
    onCropEnd,
    autoInitialize = true,
  } = options;

  const canvasRef = useRef<CropperCanvasElement>(null);
  const selectionRef = useRef<CropperSelectionElement>(null);
  const [bounds, setBoundsState] = useState<CropperBounds | null>(null);
  const [isReady, setIsReady] = useState(false);

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

  // Get current bounds
  const getBounds = useCallback((): CropperBounds | null => {
    const selection = selectionRef.current;
    if (!selection) return null;

    try {
      return selection.getBounds();
    } catch {
      return null;
    }
  }, []);

  // Set bounds
  const setBounds = useCallback(
    (newBounds: Partial<CropperBounds>): void => {
      const selection = selectionRef.current;
      if (!selection) return;

      selection.setBounds(newBounds);

      // Update local state
      const updatedBounds = getBounds();
      if (updatedBounds) {
        setBoundsState(updatedBounds);
      }
    },
    [getBounds]
  );

  // Reset cropper
  const reset = useCallback((): void => {
    const selection = selectionRef.current;
    if (!selection) return;

    selection.reset();

    // Update local state
    const updatedBounds = getBounds();
    if (updatedBounds) {
      setBoundsState(updatedBounds);
    }
  }, [getBounds]);

  // Clear selection
  const clear = useCallback((): void => {
    const selection = selectionRef.current;
    if (!selection) return;

    selection.clear();
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

  // Track if refs are ready
  const [refsReady, setRefsReady] = useState(false);

  // Check if refs are available
  useEffect(() => {
    if (!autoInitialize) return;

    const canvas = canvasRef.current;
    const selection = selectionRef.current;

    if (canvas && selection && !refsReady) {
      setRefsReady(true);
    }
  }, [autoInitialize, refsReady]);

  // Setup event listeners and initialization
  useEffect(() => {
    if (!autoInitialize || !refsReady) return;

    const canvas = canvasRef.current;
    const selection = selectionRef.current;

    if (!canvas || !selection) return;

    // Initialize
    setIsReady(true);
    if (onReadyRef.current) {
      onReadyRef.current(canvas);
    }

    // Update bounds on change
    const handleChange: CropperEventHandler = (event) => {
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
      setIsReady(false);
      setRefsReady(false);
    };
  }, [
    autoInitialize,
    refsReady,
    getBounds,
  ]);

  return {
    canvasRef,
    selectionRef,
    bounds,
    isReady,
    getBounds,
    setBounds,
    reset,
    clear,
    getCanvas,
    getSelection,
  };
}
