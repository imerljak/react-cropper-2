import { useMemo } from 'react';
import type { CropperShape } from '../types';
import { getShapeKey, resolveShape, type ResolvedShape } from '../utils/shape';

/**
 * Resolves a shape once per distinct value.
 *
 * Keyed by content rather than identity, so an inline `shape={{ ... }}` does
 * not re-resolve, re-warn or invalidate memoised callbacks on every render.
 */
export function useResolvedShape(shape: CropperShape): ResolvedShape {
  const key = getShapeKey(shape);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by value on purpose
  return useMemo(() => resolveShape(shape), [key]);
}
