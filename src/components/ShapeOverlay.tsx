import type { ResolvedPathShape } from '../utils/shape';

/** Matches the default theme colour of `<cropper-canvas>`. */
const DEFAULT_STROKE = '#39f';

const overlayStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  // Browsers clip inline <svg> by default, which would shave off the half of
  // the stroke that sits outside a path touching the viewBox edge.
  overflow: 'visible',
  // Purely visual: drags fall through to the selection's move handle.
  pointerEvents: 'none',
} as const;

/**
 * Outline of a custom shape, drawn inside `<cropper-selection>`.
 *
 * The SVG fills the selection and stretches with it (`preserveAspectRatio`
 * `none`), so resizing is handled by the browser's layout with no React
 * work per frame. The same viewBox mapping is used by the export mask, so the
 * outline always matches the exported result.
 */
export function ShapeOverlay({
  shape,
}: {
  shape: ResolvedPathShape;
}): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      data-testid="cropper-shape-overlay"
      viewBox={shape.viewBox.join(' ')}
      preserveAspectRatio="none"
      style={overlayStyle}
    >
      <path
        d={shape.path}
        fill="none"
        stroke={`var(--react-cropper-2-shape-stroke, ${DEFAULT_STROKE})`}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
