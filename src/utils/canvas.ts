import type { CropperShape, ExportOptions } from '../types';

/** Matches the browser default for `toDataURL` / `toBlob`. */
const DEFAULT_QUALITY = 0.92;

/** Formats that discard the alpha channel, so transparency becomes black. */
const OPAQUE_MIME_TYPES = new Set(['image/jpeg', 'image/jpg']);

/**
 * Creates a canvas of the given size with a 2D context.
 *
 * Returns null when no context is available, which happens in non-browser and
 * some headless environments. Callers surface that as a null export rather
 * than throwing.
 */
function createCanvas(
  width: number,
  height: number
): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } | null {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return null;

  return { canvas, context };
}

/**
 * Paints `source` onto an opaque background.
 *
 * JPEG has no alpha channel, so transparent pixels would otherwise come out
 * black. Needs a fresh canvas because filling in place would paint over the
 * existing image.
 */
export function withBackground(
  source: HTMLCanvasElement,
  fillColor: string
): HTMLCanvasElement {
  const created = createCanvas(source.width, source.height);
  if (!created) return source;

  const { canvas, context } = created;

  context.fillStyle = fillColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(source, 0, 0);

  return canvas;
}

/**
 * Clips `source` to the largest centred circle that fits inside it.
 *
 * Pixels outside the circle are left transparent, so the result only keeps its
 * round edge in formats with an alpha channel (PNG, WebP).
 */
export function maskToCircle(source: HTMLCanvasElement): HTMLCanvasElement {
  const created = createCanvas(source.width, source.height);
  if (!created) return source;

  const { canvas, context } = created;
  const radius = Math.min(canvas.width, canvas.height) / 2;

  context.save();
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
  context.closePath();
  context.clip();
  context.drawImage(source, 0, 0);
  context.restore();

  return canvas;
}

/**
 * Applies shape and background post-processing to a freshly cropped canvas.
 *
 * Order matters: the circular mask runs first so the background fill cannot
 * repaint the corners the mask just cleared.
 */
export function applyExportEffects(
  source: HTMLCanvasElement,
  options: ExportOptions = {},
  shape: CropperShape = 'rect'
): HTMLCanvasElement {
  const { mimeType = 'image/png', fillColor } = options;

  let result = shape === 'circle' ? maskToCircle(source) : source;

  // Only fill when asked, or when the format would turn transparency black.
  const needsOpaqueBackground = OPAQUE_MIME_TYPES.has(mimeType);
  const background =
    fillColor ?? (needsOpaqueBackground && shape === 'rect' ? '#fff' : null);

  if (background) {
    result = withBackground(result, background);
  }

  return result;
}

/** Resolves the encoding settings shared by every export helper. */
export function resolveEncoding(options: ExportOptions = {}): {
  mimeType: string;
  quality: number;
} {
  return {
    mimeType: options.mimeType ?? 'image/png',
    quality: options.quality ?? DEFAULT_QUALITY,
  };
}

/**
 * Promise wrapper around the callback-based `canvas.toBlob`.
 *
 * Resolves to null when encoding fails or the canvas cannot be serialised,
 * matching the browser's own `null` callback argument.
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  if (typeof canvas.toBlob !== 'function') {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}
