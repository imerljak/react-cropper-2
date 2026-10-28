import type { CSSProperties } from 'react';
import type { CropperShape } from '../types';

/**
 * Resolves the aspect ratio for a given shape.
 *
 * A circular selection is forced to 1:1. The alternative — honouring a
 * conflicting `aspectRatio` — would render an ellipse on screen while
 * `maskToCircle` still exported a circle, so the preview would lie about the
 * result. A dev-mode warning explains the override rather than letting it
 * happen silently.
 */
export function resolveAspectRatio(
  shape: CropperShape,
  aspectRatio: number | undefined
): number | undefined {
  if (shape !== 'circle') return aspectRatio;

  if (
    process.env['NODE_ENV'] !== 'production' &&
    aspectRatio !== undefined &&
    aspectRatio !== 1
  ) {
    console.warn(
      `[react-cropper-2] shape="circle" forces aspectRatio={1}; ignoring aspectRatio={${String(aspectRatio)}}.`
    );
  }

  return 1;
}

/** Styles that round off the selection and its handles for circular crops. */
export function getSelectionShapeStyle(
  shape: CropperShape
): CSSProperties | undefined {
  return shape === 'circle' ? { borderRadius: '50%' } : undefined;
}
