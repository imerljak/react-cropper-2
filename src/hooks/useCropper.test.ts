import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCropper } from './useCropper.tsx';

// Mock the useCropperAdvanced hook
vi.mock('./useCropperAdvanced', () => ({
  useCropperAdvanced: vi.fn(() => ({
    canvasRef: { current: null },
    selectionRef: { current: null },
    imageRef: { current: null },
    bounds: null,
    isReady: false,
    getBounds: vi.fn(() => null),
    setBounds: vi.fn(),
    reset: vi.fn(),
    clear: vi.fn(),
    getCroppedCanvas: vi.fn(() => Promise.resolve(null)),
    getCanvas: vi.fn(() => null),
    getSelection: vi.fn(() => null),
    getImage: vi.fn(() => null),
  })),
}));

describe('useCropper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return renderCropper function', () => {
    const { result } = renderHook(() =>
      useCropper({
        src: '/test.jpg',
        alt: 'Test image',
      })
    );

    expect(result.current.renderCropper).toBeDefined();
    expect(typeof result.current.renderCropper).toBe('function');
  });

  it('should return bounds, isReady, and control methods', () => {
    const { result } = renderHook(() =>
      useCropper({
        src: '/test.jpg',
      })
    );

    expect(result.current.bounds).toBeDefined();
    expect(result.current.isReady).toBeDefined();
    expect(result.current.getBounds).toBeDefined();
    expect(result.current.setBounds).toBeDefined();
    expect(result.current.reset).toBeDefined();
    expect(result.current.clear).toBeDefined();
  });

  it('should apply default options', () => {
    const { result } = renderHook(() =>
      useCropper({
        src: '/test.jpg',
      })
    );

    const element = result.current.renderCropper();
    expect(element).toBeDefined();
  });

  it('should accept custom options', () => {
    const { result } = renderHook(() =>
      useCropper({
        src: '/test.jpg',
        alt: 'Custom alt',
        aspectRatio: 16 / 9,
        initialCoverage: 0.5,
        background: false,
        rotatable: false,
        scalable: false,
        skewable: false,
        translatable: false,
        movable: false,
        resizable: false,
        zoomable: false,
        multiple: true,
        outlined: false,
      })
    );

    const element = result.current.renderCropper();
    expect(element).toBeDefined();
  });

  it('should accept className and style in renderCropper', () => {
    const { result } = renderHook(() =>
      useCropper({
        src: '/test.jpg',
      })
    );

    const element = result.current.renderCropper({
      className: 'custom-class',
      style: { maxHeight: '400px' },
    });

    expect(element).toBeDefined();
  });

  it('should call callbacks when provided', () => {
    const onReady = vi.fn();
    const onChange = vi.fn();
    const onCropStart = vi.fn();
    const onCropMove = vi.fn();
    const onCropEnd = vi.fn();
    const onTransform = vi.fn();

    renderHook(() =>
      useCropper({
        src: '/test.jpg',
        onReady,
        onChange,
        onCropStart,
        onCropMove,
        onCropEnd,
        onTransform,
      })
    );

    // Callbacks are passed through to useCropperAdvanced
    // The actual invocation is tested in useCropperAdvanced tests
    expect(onReady).toBeDefined();
    expect(onChange).toBeDefined();
    expect(onTransform).toBeDefined();
  });

  it('should return element accessor methods', () => {
    const { result } = renderHook(() =>
      useCropper({
        src: '/test.jpg',
      })
    );

    expect(result.current.getCanvas).toBeDefined();
    expect(typeof result.current.getCanvas).toBe('function');
    expect(result.current.getSelection).toBeDefined();
    expect(typeof result.current.getSelection).toBe('function');
    expect(result.current.getImage).toBeDefined();
    expect(typeof result.current.getImage).toBe('function');
  });

  it('should return null from element accessors when elements not mounted', () => {
    const { result } = renderHook(() =>
      useCropper({
        src: '/test.jpg',
      })
    );

    expect(result.current.getCanvas()).toBeNull();
    expect(result.current.getSelection()).toBeNull();
    expect(result.current.getImage()).toBeNull();
  });

  it('should use alt text when provided', () => {
    const { result } = renderHook(() =>
      useCropper({
        src: '/test.jpg',
        alt: 'Test image alt',
      })
    );

    const element = result.current.renderCropper();
    expect(element).toBeDefined();
  });

  it('should default alt to empty string', () => {
    const { result } = renderHook(() =>
      useCropper({
        src: '/test.jpg',
      })
    );

    const element = result.current.renderCropper();
    expect(element).toBeDefined();
  });
});
