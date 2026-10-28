import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  useCropperAdvanced,
  type UseCropperAdvancedReturn,
} from './useCropperAdvanced';
import type { TransformMatrix } from '../types';

/** Identity matrix: no rotation, no scale, no translation. */
const IDENTITY: TransformMatrix = [1, 0, 0, 1, 0, 0];

describe('transform controls', () => {
  let mockImage: HTMLElement;
  let matrix: TransformMatrix;

  beforeEach(() => {
    matrix = [...IDENTITY] as TransformMatrix;
    mockImage = document.createElement('div');
    Object.assign(mockImage, {
      $rotate: vi.fn(),
      $zoom: vi.fn(),
      $scale: vi.fn(),
      $getTransform: vi.fn(() => matrix),
      $resetTransform: vi.fn(),
    });
    document.body.appendChild(mockImage);
  });

  function renderWithImage(): UseCropperAdvancedReturn {
    const { result } = renderHook(() => useCropperAdvanced());

    Object.defineProperty(result.current.imageRef, 'current', {
      value: mockImage,
      writable: true,
      configurable: true,
    });

    return result.current;
  }

  const imageMock = (): Record<string, ReturnType<typeof vi.fn>> =>
    mockImage as unknown as Record<string, ReturnType<typeof vi.fn>>;

  describe('rotate', () => {
    it('passes the angle with an explicit degree unit', () => {
      // CropperJS treats a bare number as radians, so rotate(90) would
      // otherwise spin the image roughly 5157 degrees.
      renderWithImage().rotate(90);

      expect(imageMock()['$rotate']).toHaveBeenCalledWith('90deg');
    });

    it('supports negative angles', () => {
      renderWithImage().rotate(-90);

      expect(imageMock()['$rotate']).toHaveBeenCalledWith('-90deg');
    });

    it('supports fractional angles', () => {
      renderWithImage().rotate(22.5);

      expect(imageMock()['$rotate']).toHaveBeenCalledWith('22.5deg');
    });

    it('does nothing when there is no image', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      expect(() => result.current.rotate(90)).not.toThrow();
    });
  });

  describe('zoom', () => {
    it('applies a relative zoom ratio', () => {
      renderWithImage().zoom(0.1);

      expect(imageMock()['$zoom']).toHaveBeenCalledWith(0.1);
    });

    it('supports zooming out', () => {
      renderWithImage().zoom(-0.1);

      expect(imageMock()['$zoom']).toHaveBeenCalledWith(-0.1);
    });

    it('does nothing when there is no image', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      expect(() => result.current.zoom(0.1)).not.toThrow();
    });
  });

  describe('setZoom', () => {
    it('scales from the identity matrix straight to the target level', () => {
      renderWithImage().setZoom(2);

      expect(imageMock()['$scale']).toHaveBeenCalledWith(2);
    });

    it('converts an absolute level into a relative factor', () => {
      matrix = [2, 0, 0, 2, 0, 0];

      renderWithImage().setZoom(3);

      // Already at 2x, so reaching 3x needs a further 1.5x.
      expect(imageMock()['$scale']).toHaveBeenCalledWith(1.5);
    });

    it('derives the current scale correctly while rotated', () => {
      // 90-degree rotation at 2x: a is 0, so reading `a` alone would be wrong.
      matrix = [0, 2, -2, 0, 0, 0];

      renderWithImage().setZoom(4);

      expect(imageMock()['$scale']).toHaveBeenCalledWith(2);
    });

    it('ignores non-positive levels', () => {
      const cropper = renderWithImage();

      cropper.setZoom(0);
      cropper.setZoom(-1);

      expect(imageMock()['$scale']).not.toHaveBeenCalled();
    });

    it('does nothing when the current scale is degenerate', () => {
      matrix = [0, 0, 0, 0, 0, 0];

      renderWithImage().setZoom(2);

      expect(imageMock()['$scale']).not.toHaveBeenCalled();
    });

    it('does nothing when the transform cannot be read', () => {
      Object.assign(mockImage, { $getTransform: undefined });

      expect(() => renderWithImage().setZoom(2)).not.toThrow();
      expect(imageMock()['$scale']).not.toHaveBeenCalled();
    });

    it('does nothing when there is no image', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      expect(() => result.current.setZoom(2)).not.toThrow();
    });
  });

  describe('flip', () => {
    it('mirrors horizontally across the vertical axis', () => {
      renderWithImage().flipHorizontal();

      expect(imageMock()['$scale']).toHaveBeenCalledWith(-1, 1);
    });

    it('mirrors vertically across the horizontal axis', () => {
      renderWithImage().flipVertical();

      expect(imageMock()['$scale']).toHaveBeenCalledWith(1, -1);
    });

    it('composes with an active rotation rather than resetting it', () => {
      matrix = [0, 1, -1, 0, 0, 0];
      const cropper = renderWithImage();

      cropper.flipHorizontal();

      // $scale multiplies the existing matrix, so the rotation survives.
      expect(imageMock()['$scale']).toHaveBeenCalledWith(-1, 1);
      expect(imageMock()['$resetTransform']).not.toHaveBeenCalled();
    });

    it('is self-inverse when applied twice', () => {
      const cropper = renderWithImage();

      cropper.flipHorizontal();
      cropper.flipHorizontal();

      expect(imageMock()['$scale']).toHaveBeenNthCalledWith(1, -1, 1);
      expect(imageMock()['$scale']).toHaveBeenNthCalledWith(2, -1, 1);
    });

    it('does nothing when there is no image', () => {
      const { result } = renderHook(() => useCropperAdvanced());

      expect(() => {
        result.current.flipHorizontal();
        result.current.flipVertical();
      }).not.toThrow();
    });
  });
});
