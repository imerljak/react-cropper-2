import { useEffect, useId, useState, type CSSProperties } from 'react';
import type { CropperRef } from './Cropper';
import type { CropperShape } from '../types';
import { getSelectionShapeStyle } from '../utils/shape';

/** Resize modes supported by `<cropper-viewer>` */
export type CropperPreviewResize = 'both' | 'horizontal' | 'vertical' | 'none';

/**
 * Props for the CropperPreview component
 */
export interface CropperPreviewProps {
  /** Ref of the cropper to mirror */
  cropperRef: React.RefObject<CropperRef | null>;
  /** Preview width in pixels */
  width: number;
  /**
   * Preview height in pixels. When omitted, the height follows the crop's
   * aspect ratio (`resize="vertical"`), except for `shape="circle"`, which
   * stays square.
   */
  height?: number;
  /** Preview shape. `circle` rounds the thumbnail. Defaults to `rect`. */
  shape?: CropperShape;
  /**
   * How the viewer follows the selection's shape. Defaults to `'vertical'`
   * when `height` is omitted and to `'none'` otherwise. With `'none'`, the
   * crop is scaled to the box's width, so the box should match the
   * selection's aspect ratio or the crop is clipped or letterboxed.
   */
  resize?: CropperPreviewResize;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: CSSProperties;
}

/**
 * Live thumbnail of the current crop.
 *
 * Wraps CropperJS's `<cropper-viewer>`, which mirrors the selection inside its
 * own shadow DOM. Updates therefore bypass React entirely: dragging the
 * selection re-renders nothing in the React tree, however many previews are
 * mounted.
 *
 * @example
 * ```tsx
 * const cropperRef = useRef<CropperRef>(null);
 *
 * <Cropper ref={cropperRef} src="/avatar.jpg" shape="circle" />
 * <CropperPreview cropperRef={cropperRef} width={128} height={128} />
 * <CropperPreview cropperRef={cropperRef} width={48} height={48} shape="circle" />
 * // Free-ratio selection: height follows the crop
 * <CropperPreview cropperRef={cropperRef} width={160} />
 * ```
 */
export function CropperPreview({
  cropperRef,
  width,
  height,
  shape = 'rect',
  resize,
  className,
  style,
}: CropperPreviewProps): React.JSX.Element {
  // The viewer locates its source by CSS selector, so the selection needs a
  // stable, unique id. useId covers multiple croppers on one page.
  const generatedId = useId().replace(/:/g, '');
  const selectionId = `react-cropper-2-selection-${generatedId}`;

  // The ref is null on first render, so resolving the selection has to wait
  // for the effect. Holding it in state re-renders once the id is attached.
  const [selector, setSelector] = useState<string | null>(null);

  const followsCrop = height === undefined && shape !== 'circle';
  const boxHeight = followsCrop ? undefined : (height ?? width);
  const resizeMode = resize ?? (followsCrop ? 'vertical' : 'none');

  useEffect(() => {
    let cancelled = false;
    let rafId: number | null = null;

    // <cropper-viewer> reads `$image` off the source <cropper-image> when it
    // connects, and that property only exists once the custom element has
    // upgraded. Mounting too early throws "Cannot read properties of
    // undefined (reading 'addEventListener')", so wait for the upgrade.
    const attachWhenReady = (): void => {
      if (cancelled) return;

      const selection = cropperRef.current?.getSelection();
      const image = cropperRef.current?.getImage();

      if (!selection || !image || !('$image' in image)) {
        rafId = requestAnimationFrame(attachWhenReady);
        return;
      }

      // Reuse an existing id so we never clobber one the consumer set.
      if (!selection.id) {
        selection.id = selectionId;
      }

      setSelector(`#${selection.id}`);
    };

    attachWhenReady();

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [cropperRef, selectionId]);

  if (!selector) {
    // Reserve the layout box so mounting the viewer does not shift content.
    return (
      <div
        className={className}
        style={{
          width,
          height: boxHeight ?? width,
          ...getSelectionShapeStyle(shape),
          ...style,
        }}
        data-testid="cropper-preview-placeholder"
      />
    );
  }

  return (
    <cropper-viewer
      selection={selector}
      resize={resizeMode}
      class={className}
      style={{
        width,
        height: boxHeight,
        overflow: 'hidden',
        ...getSelectionShapeStyle(shape),
        ...style,
      }}
    />
  );
}

CropperPreview.displayName = 'CropperPreview';
