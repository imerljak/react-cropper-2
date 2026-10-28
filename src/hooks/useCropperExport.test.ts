import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { render } from '@testing-library/react';
import {
  useCropperAdvanced,
  type UseCropperAdvancedOptions,
  type UseCropperAdvancedReturn,
} from './useCropperAdvanced';

/**
 * Export helper tests.
 *
 * jsdom cannot rasterise, so the cropped canvas is stubbed and assertions
 * target the encoding arguments and the resulting Blob/File/data-URL shapes.
 */
describe('export helpers', () => {
  let mockSelection: HTMLElement;
  let croppedCanvas: HTMLCanvasElement;

  beforeEach(() => {
    // Stub on the prototype: post-processing (circular mask, background fill)
    // creates fresh canvases, and jsdom's native toBlob never calls back.
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(((
      callback: BlobCallback,
      type?: string
    ) => {
      callback(new Blob(['pixels'], { type: type ?? 'image/png' }));
    }) as HTMLCanvasElement['toBlob']);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(
      ((type?: string) =>
        `data:${type ?? 'image/png'};base64,AAAA`) as HTMLCanvasElement['toDataURL']
    );

    croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = 120;
    croppedCanvas.height = 120;

    mockSelection = document.createElement('div');
    Object.assign(mockSelection, {
      x: 0,
      y: 0,
      width: 120,
      height: 120,
      $toCanvas: vi.fn().mockResolvedValue(croppedCanvas),
    });
    document.body.appendChild(mockSelection);
  });

  function renderWithSelection(
    options: UseCropperAdvancedOptions = {}
  ): UseCropperAdvancedReturn {
    const { result } = renderHook(() => useCropperAdvanced(options));

    Object.defineProperty(result.current.selectionRef, 'current', {
      value: mockSelection,
      writable: true,
      configurable: true,
    });

    return result.current;
  }

  describe('getCroppedBlob', () => {
    it('resolves a Blob encoded with the requested type', async () => {
      const cropper = renderWithSelection();

      const blob = await cropper.getCroppedBlob({ mimeType: 'image/webp' });

      expect(blob).toBeInstanceOf(Blob);
      expect(blob?.type).toBe('image/webp');
    });

    it('defaults to png at the browser default quality', async () => {
      const cropper = renderWithSelection();

      await cropper.getCroppedBlob();

      expect(croppedCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/png',
        0.92
      );
    });

    it('forwards an explicit quality to the encoder', async () => {
      const cropper = renderWithSelection();

      await cropper.getCroppedBlob({ mimeType: 'image/jpeg', quality: 0.3 });

      expect(croppedCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.3
      );
    });

    it('forwards sizing options to the cropper', async () => {
      const cropper = renderWithSelection();

      await cropper.getCroppedBlob({ width: 64, height: 64 });

      expect(
        (mockSelection as unknown as { $toCanvas: ReturnType<typeof vi.fn> })
          .$toCanvas
      ).toHaveBeenCalledWith({ width: 64, height: 64 });
    });

    it('does not leak encoding options into the cropper call', async () => {
      const cropper = renderWithSelection();

      await cropper.getCroppedBlob({ mimeType: 'image/jpeg', quality: 0.5 });

      expect(
        (mockSelection as unknown as { $toCanvas: ReturnType<typeof vi.fn> })
          .$toCanvas
      ).toHaveBeenCalledWith({});
    });

    it('resolves null when there is no selection', async () => {
      const { result } = renderHook(() => useCropperAdvanced());

      await expect(result.current.getCroppedBlob()).resolves.toBeNull();
    });
  });

  describe('getCroppedFile', () => {
    it('resolves a File carrying the given name and mime type', async () => {
      const cropper = renderWithSelection();

      const file = await cropper.getCroppedFile('avatar.webp', {
        mimeType: 'image/webp',
      });

      expect(file).toBeInstanceOf(File);
      expect(file?.name).toBe('avatar.webp');
      expect(file?.type).toBe('image/webp');
    });

    it('resolves null when there is no selection', async () => {
      const { result } = renderHook(() => useCropperAdvanced());

      await expect(result.current.getCroppedFile('x.png')).resolves.toBeNull();
    });

    it('resolves null when encoding fails', async () => {
      croppedCanvas.toBlob = vi.fn((callback: BlobCallback) => {
        callback(null);
      }) as unknown as HTMLCanvasElement['toBlob'];
      const cropper = renderWithSelection();

      await expect(cropper.getCroppedFile('x.png')).resolves.toBeNull();
    });
  });

  describe('getCroppedDataURL', () => {
    it('resolves a data URL for the requested type', async () => {
      const cropper = renderWithSelection();

      const dataUrl = await cropper.getCroppedDataURL({
        mimeType: 'image/jpeg',
        quality: 0.8,
      });

      expect(dataUrl).toBe('data:image/jpeg;base64,AAAA');
      expect(croppedCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.8);
    });

    it('resolves null when there is no selection', async () => {
      const { result } = renderHook(() => useCropperAdvanced());

      await expect(result.current.getCroppedDataURL()).resolves.toBeNull();
    });
  });

  describe('shape option', () => {
    it('masks exports to a circle when shape is circle', async () => {
      const context = {
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        closePath: vi.fn(),
        arc: vi.fn(),
        clip: vi.fn(),
        drawImage: vi.fn(),
        fillRect: vi.fn(),
        fillStyle: '',
      };
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
        context as unknown as RenderingContext
      );

      const cropper = renderWithSelection({ shape: 'circle' });
      await cropper.getCroppedBlob();

      expect(context.arc).toHaveBeenCalled();
      expect(context.clip).toHaveBeenCalled();
    });

    it('does not mask when shape is rect', async () => {
      const context = {
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        closePath: vi.fn(),
        arc: vi.fn(),
        clip: vi.fn(),
        drawImage: vi.fn(),
        fillRect: vi.fn(),
        fillStyle: '',
      };
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
        context as unknown as RenderingContext
      );

      const cropper = renderWithSelection({ shape: 'rect' });
      await cropper.getCroppedBlob();

      expect(context.arc).not.toHaveBeenCalled();
    });
  });

  describe('getCroppedCanvas', () => {
    it('keeps returning a promise, not a bare canvas', () => {
      const cropper = renderWithSelection();

      expect(cropper.getCroppedCanvas()).toBeInstanceOf(Promise);
    });

    it('warns and resolves null when the web component is not initialised', async () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const bare = document.createElement('div');
      const { result } = renderHook(() => useCropperAdvanced());
      Object.defineProperty(result.current.selectionRef, 'current', {
        value: bare,
        writable: true,
        configurable: true,
      });

      await expect(result.current.getCroppedCanvas()).resolves.toBeNull();
      expect(warn).toHaveBeenCalled();
    });
  });

  it('exposes the helpers through the rendered hook surface', () => {
    let api: UseCropperAdvancedReturn | null = null;
    function Probe(): null {
      api = useCropperAdvanced();
      return null;
    }
    render(createElement(Probe));

    expect(typeof api!.getCroppedBlob).toBe('function');
    expect(typeof api!.getCroppedFile).toBe('function');
    expect(typeof api!.getCroppedDataURL).toBe('function');
  });
});
