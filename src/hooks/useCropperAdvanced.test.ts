import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act, render } from '@testing-library/react';
import type { CropperBounds } from '../types';
import { createElement } from 'react';
import {
  useCropperAdvanced,
  UseCropperAdvancedOptions,
  UseCropperAdvancedReturn,
} from './useCropperAdvanced';

/**
 * Test suite for useCropper hook
 * Following TDD - tests written first, implementation follows
 */
describe('useCropper Hook', () => {
  // Mock elements
  let mockCanvas: HTMLElement;
  let mockSelection: HTMLElement;

  beforeEach(() => {
    // Create mock elements
    mockCanvas = document.createElement('div');
    mockSelection = document.createElement('div');

    // Add mock properties and methods to selection matching CropperJS 2.x API
    Object.assign(mockSelection, {
      // Properties
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      aspectRatio: 0,
      initialAspectRatio: 0,
      initialCoverage: 0.8,
      // Methods (prefixed with $)
      $change: vi.fn(),
      $reset: vi.fn(),
      $clear: vi.fn(),
      $center: vi.fn(),
      $move: vi.fn(),
      $moveTo: vi.fn(),
      $resize: vi.fn(),
      $zoom: vi.fn(),
      $toCanvas: vi.fn().mockResolvedValue(document.createElement('canvas')),
    });

    document.body.appendChild(mockCanvas);
    document.body.appendChild(mockSelection);
  });

  // Helper to properly test hooks with refs attached
  function renderHookWithRefs(
    options: UseCropperAdvancedOptions = {}
  ): ReturnType<typeof render> & {
    result: { current: UseCropperAdvancedReturn };
  } {
    let hookReturn: UseCropperAdvancedReturn | null = null;

    function TestComponent(): null {
      const hook = useCropperAdvanced(options);
      hookReturn = hook;

      // Attach refs immediately on first render
      if (hook.canvasRef.current === null) {
        Object.defineProperty(hook.canvasRef, 'current', {
          value: mockCanvas,
          writable: true,
          configurable: true,
        });
      }
      if (hook.selectionRef.current === null) {
        Object.defineProperty(hook.selectionRef, 'current', {
          value: mockSelection,
          writable: true,
          configurable: true,
        });
      }
      if (hook.imageRef.current === null) {
        Object.defineProperty(hook.imageRef, 'current', {
          value: mockSelection,
          writable: true,
          configurable: true,
        });
      }

      return null;
    }

    const renderResult = render(createElement(TestComponent));

    return {
      result: {
        get current(): UseCropperAdvancedReturn {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return hookReturn!;
        },
      },
      ...renderResult,
    };
  }

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      expect(result.current.canvasRef.current).toBeNull();
      expect(result.current.selectionRef.current).toBeNull();
      expect(result.current.bounds).toBeNull();
      expect(result.current.isReady).toBe(false);
    });

    it('should provide refs for canvas and selection', () => {
      const hookResult = renderHook(() => useCropperAdvanced());

      expect(hookResult.result.current.canvasRef).toBeDefined();
      expect(hookResult.result.current.selectionRef).toBeDefined();
    });

    it('should call onReady when auto-initialized', async () => {
      const onReady = vi.fn();
      renderHookWithRefs({ onReady });

      await waitFor(() => {
        expect(onReady).toHaveBeenCalledTimes(1);
      });
    });

    it('should not auto-initialize when autoInitialize is false', () => {
      const onReady = vi.fn();
      renderHook(() => useCropperAdvanced({ onReady, autoInitialize: false }));

      expect(onReady).not.toHaveBeenCalled();
    });

    it('should set isReady to true after initialization', async () => {
      const { result } = renderHookWithRefs();

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });
    });
  });

  describe('getBounds', () => {
    it('should return null when selection is not set', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      const bounds = result.current.getBounds();
      expect(bounds).toBeNull();
    });

    it('should return bounds from selection element', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      // Set selection ref
      Object.defineProperty(result.current.selectionRef, 'current', {
        value: mockSelection,
        writable: true,
      });

      const bounds = result.current.getBounds();
      expect(bounds).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 80,
      });
    });
  });

  describe('setBounds', () => {
    it('should update bounds on selection element', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      Object.defineProperty(result.current.selectionRef, 'current', {
        value: mockSelection,
        writable: true,
      });

      const newBounds: Partial<CropperBounds> = {
        x: 50,
        y: 60,
        width: 200,
        height: 150,
      };

      result.current.setBounds(newBounds);

      expect((mockSelection as any).$change).toHaveBeenCalledWith(
        50,
        60,
        200,
        150
      );
    });

    it('should update local bounds state after setBounds', async () => {
      const { result } = renderHookWithRefs();

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      act(() => {
        result.current.setBounds({ x: 30, y: 40 });
      });

      expect(result.current.bounds).toBeTruthy();
    });

    it('should handle null selection gracefully', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      expect(() => {
        result.current.setBounds({ x: 10, y: 20 });
      }).not.toThrow();
    });
  });

  describe('reset', () => {
    it('should call reset on selection element', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      Object.defineProperty(result.current.selectionRef, 'current', {
        value: mockSelection,
        writable: true,
      });

      result.current.reset();

      expect((mockSelection as any).$reset).toHaveBeenCalledTimes(1);
    });

    it('should update bounds state after reset', async () => {
      const { result } = renderHookWithRefs();

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.bounds).toBeTruthy();
    });

    it('should handle null selection gracefully', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      expect(() => {
        result.current.reset();
      }).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should call clear on selection element', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      Object.defineProperty(result.current.selectionRef, 'current', {
        value: mockSelection,
        writable: true,
      });

      result.current.clear();

      expect((mockSelection as any).$clear).toHaveBeenCalledTimes(1);
    });

    it('should set bounds to null after clear', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      Object.defineProperty(result.current.selectionRef, 'current', {
        value: mockSelection,
        writable: true,
      });

      result.current.clear();

      expect(result.current.bounds).toBeNull();
    });

    it('should handle null selection gracefully', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      expect(() => {
        result.current.clear();
      }).not.toThrow();
    });
  });

  describe('Event Handlers', () => {
    it('should attach onChange listener', async () => {
      const onChange = vi.fn();
      const { result } = renderHookWithRefs({ onChange });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      // Dispatch change event
      const event = new CustomEvent('change', {
        detail: { bounds: { x: 0, y: 0, width: 100, height: 100 } },
      });
      mockSelection.dispatchEvent(event);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(1);
      });
    });

    it('should attach onCropStart listener', async () => {
      const onCropStart = vi.fn();
      const { result } = renderHookWithRefs({ onCropStart });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      const event = new CustomEvent('cropstart');
      mockSelection.dispatchEvent(event);

      await waitFor(() => {
        expect(onCropStart).toHaveBeenCalledTimes(1);
      });
    });

    it('should update bounds state on change event', async () => {
      const { result } = renderHookWithRefs();

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      const event = new CustomEvent('change');
      mockSelection.dispatchEvent(event);

      await waitFor(() => {
        expect(result.current.bounds).toBeTruthy();
      });
    });

    it('should cleanup event listeners on unmount', () => {
      const onChange = vi.fn();
      const { result, unmount, rerender } = renderHook(() =>
        useCropperAdvanced({ onChange })
      );

      Object.defineProperty(result.current.canvasRef, 'current', {
        value: mockCanvas,
        writable: true,
      });
      Object.defineProperty(result.current.selectionRef, 'current', {
        value: mockSelection,
        writable: true,
      });

      rerender();
      unmount();

      const event = new CustomEvent('change');
      mockSelection.dispatchEvent(event);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Utility Methods', () => {
    it('should return canvas element via getCanvas', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      Object.defineProperty(result.current.canvasRef, 'current', {
        value: mockCanvas,
        writable: true,
      });

      const canvas = result.current.getCanvas();
      expect(canvas).toBe(mockCanvas);
    });

    it('should return selection element via getSelection', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      Object.defineProperty(result.current.selectionRef, 'current', {
        value: mockSelection,
        writable: true,
      });

      const selection = result.current.getSelection();
      expect(selection).toBe(mockSelection);
    });

    it('should return null when elements not set', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      expect(result.current.getCanvas()).toBeNull();
      expect(result.current.getSelection()).toBeNull();
    });
  });
});
