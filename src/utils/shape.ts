import type { CSSProperties } from 'react';
import type { CropperShape, CropperShapeDefinition } from '../types';

/** A custom shape whose inputs have been validated and normalised. */
export interface ResolvedPathShape {
  path: string;
  viewBox: [number, number, number, number];
  stretch: boolean;
}

/** A shape ready for rendering and export: built-in name or validated path. */
export type ResolvedShape = 'rect' | 'circle' | ResolvedPathShape;

/** Tolerance when comparing aspect ratios, so float noise does not warn. */
const ASPECT_RATIO_EPSILON = 1e-6;

/**
 * Whether the bundle is running in production.
 *
 * `process` does not exist in browsers, and not every bundler shims it, so
 * reading it unguarded throws `ReferenceError: process is not defined`.
 * Unknown environments are treated as development: an extra warning is far
 * cheaper than a crash.
 */
function isProduction(): boolean {
  if (typeof process === 'undefined') return false;

  // Types promise `env` always exists, but a partial shim may not provide it.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return process.env?.['NODE_ENV'] === 'production';
}

function warn(message: string): void {
  if (!isProduction()) {
    console.warn(`[react-cropper-2] ${message}`);
  }
}

export function isPathShape(shape: ResolvedShape): shape is ResolvedPathShape {
  return typeof shape === 'object';
}

/** Parses a viewBox tuple or SVG attribute string; null when unusable. */
function parseViewBox(
  viewBox: CropperShapeDefinition['viewBox']
): [number, number, number, number] | null {
  const values =
    typeof viewBox === 'string'
      ? viewBox
          .trim()
          .split(/[\s,]+/)
          .map(Number)
      : viewBox;

  if (values.length !== 4 || !values.every(Number.isFinite)) return null;

  const [minX, minY, width, height] = values as [
    number,
    number,
    number,
    number,
  ];
  if (width <= 0 || height <= 0) return null;

  return [minX, minY, width, height];
}

/**
 * Validates a shape and normalises it for rendering and export.
 *
 * An unusable custom shape falls back to `'rect'` with a dev warning. The
 * alternative is worse: `Path2D` silently drops invalid path data, so a bad
 * path would export a fully transparent image.
 */
export function resolveShape(shape: CropperShape): ResolvedShape {
  if (typeof shape === 'string') return shape;

  // Only a moveto can start valid path data; anything else draws nothing.
  const path = shape.path.trim();
  if (!/^[Mm]/.test(path)) {
    warn(
      'Custom shape path must be SVG path data starting with "M"; falling back to shape="rect".'
    );
    return 'rect';
  }

  const viewBox = parseViewBox(shape.viewBox);
  if (!viewBox) {
    warn(
      `Custom shape viewBox must be four finite numbers with a positive width and height; got ${JSON.stringify(shape.viewBox)}. Falling back to shape="rect".`
    );
    return 'rect';
  }

  return { path, viewBox, stretch: shape.stretch ?? false };
}

/**
 * Content key for a shape, so inline shape objects can be memoised by value
 * rather than by identity.
 */
export function getShapeKey(shape: CropperShape): string {
  if (typeof shape === 'string') return shape;

  return JSON.stringify([shape.path, shape.viewBox, shape.stretch ?? false]);
}

/**
 * Resolves the aspect ratio for a given shape.
 *
 * A circular selection is forced to 1:1, and a custom shape to its viewBox
 * ratio unless it opts into stretching. The alternative — honouring a
 * conflicting `aspectRatio` — would distort the shape. A dev-mode warning
 * explains the override rather than letting it happen silently.
 */
export function resolveAspectRatio(
  shape: ResolvedShape,
  aspectRatio: number | undefined
): number | undefined {
  if (shape === 'rect') return aspectRatio;

  if (shape === 'circle') {
    if (aspectRatio !== undefined && aspectRatio !== 1) {
      warn(
        `shape="circle" forces aspectRatio={1}; ignoring aspectRatio={${String(aspectRatio)}}.`
      );
    }
    return 1;
  }

  if (shape.stretch) return aspectRatio;

  const [, , width, height] = shape.viewBox;
  const shapeRatio = width / height;

  if (
    aspectRatio !== undefined &&
    Math.abs(aspectRatio - shapeRatio) > ASPECT_RATIO_EPSILON
  ) {
    warn(
      `Custom shapes lock the selection to their viewBox ratio (${String(shapeRatio)}); ignoring aspectRatio={${String(aspectRatio)}}. Set stretch: true to allow distortion.`
    );
  }

  return shapeRatio;
}

/** Styles that round off the selection and its handles for circular crops. */
export function getSelectionShapeStyle(
  shape: ResolvedShape
): CSSProperties | undefined {
  return shape === 'circle' ? { borderRadius: '50%' } : undefined;
}

/**
 * Builds a custom shape from polygon vertices in the 0–1 unit square.
 *
 * @example
 * const diamond = polygonShape([[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]]);
 */
export function polygonShape(
  points: ReadonlyArray<readonly [number, number]>
): CropperShapeDefinition {
  if (points.length < 3) {
    throw new Error(
      `[react-cropper-2] polygonShape needs at least 3 points; got ${String(points.length)}.`
    );
  }

  const outOfRange = points.find(
    (point) => !point.every((value) => value >= 0 && value <= 1)
  );
  if (outOfRange) {
    throw new Error(
      `[react-cropper-2] polygonShape points must lie within 0–1; got [${outOfRange.join(', ')}].`
    );
  }

  const [first, ...rest] = points.map(([x, y]) => `${String(x)} ${String(y)}`);
  const path = `M ${String(first)} ${rest.map((point) => `L ${point}`).join(' ')} Z`;

  return { path, viewBox: [0, 0, 1, 1] };
}
