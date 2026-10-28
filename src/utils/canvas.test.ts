import { describe, it, expect, vi } from 'vitest';
import {
  applyExportEffects,
  canvasToBlob,
  maskToCircle,
  resolveEncoding,
  withBackground,
} from './canvas';

/**
 * jsdom has no real 2D rasteriser, so these tests assert on the drawing
 * commands issued rather than on pixel output. A stub context records calls.
 */
function stubCanvas(width = 100, height = 100): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function stubContext(): CanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    arc: vi.fn(),
    clip: vi.fn(),
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: '',
  } as unknown as CanvasRenderingContext2D;
}

/** Points freshly created canvases at a recording context. */
function withStubbedContext(context: CanvasRenderingContext2D): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    context as unknown as RenderingContext
  );
}

describe('resolveEncoding', () => {
  it('defaults to png at quality 0.92', () => {
    expect(resolveEncoding()).toEqual({
      mimeType: 'image/png',
      quality: 0.92,
    });
  });

  it('honours explicit options', () => {
    expect(resolveEncoding({ mimeType: 'image/webp', quality: 0.5 })).toEqual({
      mimeType: 'image/webp',
      quality: 0.5,
    });
  });

  it('keeps a quality of 0 rather than treating it as missing', () => {
    expect(resolveEncoding({ quality: 0 }).quality).toBe(0);
  });
});

describe('withBackground', () => {
  it('fills the background before drawing the source on top', () => {
    const context = stubContext();
    withStubbedContext(context);

    withBackground(stubCanvas(), '#ff0000');

    expect(context.fillStyle).toBe('#ff0000');
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);

    // Drawing after filling is what keeps the image visible.
    const fillOrder = vi.mocked(context.fillRect).mock.invocationCallOrder[0];
    const drawOrder = vi.mocked(context.drawImage).mock.invocationCallOrder[0];
    expect(fillOrder).toBeLessThan(drawOrder as number);
  });

  it('returns the source unchanged when no context is available', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const source = stubCanvas();

    expect(withBackground(source, '#fff')).toBe(source);
  });
});

describe('maskToCircle', () => {
  it('clips to the largest centred circle that fits', () => {
    const context = stubContext();
    withStubbedContext(context);

    maskToCircle(stubCanvas(200, 100));

    // Radius is bounded by the shorter side.
    expect(context.arc).toHaveBeenCalledWith(100, 50, 50, 0, Math.PI * 2);
    expect(context.clip).toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenCalled();
  });

  it('clips before drawing so the corners stay transparent', () => {
    const context = stubContext();
    withStubbedContext(context);

    maskToCircle(stubCanvas());

    const clipOrder = vi.mocked(context.clip).mock.invocationCallOrder[0];
    const drawOrder = vi.mocked(context.drawImage).mock.invocationCallOrder[0];
    expect(clipOrder).toBeLessThan(drawOrder as number);
  });

  it('returns the source unchanged when no context is available', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const source = stubCanvas();

    expect(maskToCircle(source)).toBe(source);
  });
});

describe('applyExportEffects', () => {
  it('leaves a plain png crop untouched', () => {
    const source = stubCanvas();

    expect(applyExportEffects(source, { mimeType: 'image/png' })).toBe(source);
  });

  it('fills a white background for jpeg, which has no alpha channel', () => {
    const context = stubContext();
    withStubbedContext(context);

    applyExportEffects(stubCanvas(), { mimeType: 'image/jpeg' });

    expect(context.fillStyle).toBe('#fff');
    expect(context.fillRect).toHaveBeenCalled();
  });

  it('prefers an explicit fillColor over the jpeg default', () => {
    const context = stubContext();
    withStubbedContext(context);

    applyExportEffects(stubCanvas(), {
      mimeType: 'image/jpeg',
      fillColor: '#00ff00',
    });

    expect(context.fillStyle).toBe('#00ff00');
  });

  it('applies a fillColor even for formats that support alpha', () => {
    const context = stubContext();
    withStubbedContext(context);

    applyExportEffects(stubCanvas(), {
      mimeType: 'image/png',
      fillColor: '#0000ff',
    });

    expect(context.fillStyle).toBe('#0000ff');
  });

  it('masks to a circle when the shape is circle', () => {
    const context = stubContext();
    withStubbedContext(context);

    applyExportEffects(stubCanvas(), { mimeType: 'image/png' }, 'circle');

    expect(context.arc).toHaveBeenCalled();
    expect(context.clip).toHaveBeenCalled();
  });

  it('does not auto-fill a circular jpeg, which would repaint the corners', () => {
    const context = stubContext();
    withStubbedContext(context);

    applyExportEffects(stubCanvas(), { mimeType: 'image/jpeg' }, 'circle');

    expect(context.clip).toHaveBeenCalled();
    expect(context.fillRect).not.toHaveBeenCalled();
  });

  it('still honours an explicit fillColor for a circular crop', () => {
    const context = stubContext();
    withStubbedContext(context);

    applyExportEffects(
      stubCanvas(),
      { mimeType: 'image/png', fillColor: '#123456' },
      'circle'
    );

    // Mask first, then fill — otherwise the fill would undo the mask.
    const clipOrder = vi.mocked(context.clip).mock.invocationCallOrder[0];
    const fillOrder = vi.mocked(context.fillRect).mock.invocationCallOrder[0];
    expect(clipOrder).toBeLessThan(fillOrder as number);
  });
});

describe('canvasToBlob', () => {
  it('resolves the encoded blob', async () => {
    const canvas = stubCanvas();
    const blob = new Blob(['x'], { type: 'image/png' });
    canvas.toBlob = vi.fn((callback) => {
      callback(blob);
    }) as HTMLCanvasElement['toBlob'];

    await expect(canvasToBlob(canvas, 'image/png', 0.92)).resolves.toBe(blob);
  });

  it('forwards the mime type and quality to the encoder', async () => {
    const canvas = stubCanvas();
    const toBlob = vi.fn((callback: BlobCallback) => {
      callback(new Blob([]));
    });
    canvas.toBlob = toBlob as unknown as HTMLCanvasElement['toBlob'];

    await canvasToBlob(canvas, 'image/webp', 0.4);

    expect(toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/webp',
      0.4
    );
  });

  it('resolves null when the encoder fails', async () => {
    const canvas = stubCanvas();
    canvas.toBlob = vi.fn((callback) => {
      callback(null);
    }) as HTMLCanvasElement['toBlob'];

    await expect(canvasToBlob(canvas, 'image/png', 0.92)).resolves.toBeNull();
  });

  it('resolves null when toBlob is unavailable', async () => {
    const canvas = stubCanvas();
    // @ts-expect-error — simulating an environment without toBlob
    canvas.toBlob = undefined;

    await expect(canvasToBlob(canvas, 'image/png', 0.92)).resolves.toBeNull();
  });
});
