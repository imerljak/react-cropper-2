import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createRef, useRef } from 'react';
import { Cropper, type CropperRef } from './Cropper';
import { CropperPreview } from './CropperPreview';

/** Renders a cropper with previews wired to its ref. */
function Harness({
  previews = [{ width: 128, height: 128 }],
  shape,
}: {
  previews?: Array<{ width: number; height: number }>;
  shape?: 'rect' | 'circle';
}): React.JSX.Element {
  const cropperRef = useRef<CropperRef>(null);

  return (
    <div>
      <Cropper ref={cropperRef} src="/test-image.jpg" />
      {previews.map((preview, index) => (
        <CropperPreview
          key={index}
          cropperRef={cropperRef}
          width={preview.width}
          height={preview.height}
          {...(shape && { shape })}
        />
      ))}
    </div>
  );
}

describe('CropperPreview', () => {
  it('renders a placeholder before the cropper ref resolves', () => {
    const detachedRef = createRef<CropperRef>();

    render(<CropperPreview cropperRef={detachedRef} width={64} height={64} />);

    expect(
      screen.getByTestId('cropper-preview-placeholder')
    ).toBeInTheDocument();
  });

  it('reserves the final layout box while showing the placeholder', () => {
    const detachedRef = createRef<CropperRef>();

    render(<CropperPreview cropperRef={detachedRef} width={64} height={48} />);

    expect(screen.getByTestId('cropper-preview-placeholder')).toHaveStyle({
      width: '64px',
      height: '48px',
    });
  });

  it('mounts a cropper-viewer once the selection is available', async () => {
    render(<Harness />);

    await waitFor(() => {
      expect(document.querySelector('cropper-viewer')).toBeInTheDocument();
    });
  });

  it('points the viewer at the cropper selection', async () => {
    render(<Harness />);

    await waitFor(() => {
      expect(document.querySelector('cropper-viewer')).toBeInTheDocument();
    });

    const viewer = document.querySelector('cropper-viewer');
    const selection = document.querySelector('cropper-selection');

    expect(selection?.id).toBeTruthy();
    expect(viewer).toHaveAttribute('selection', `#${selection?.id ?? ''}`);
  });

  it('applies the requested dimensions', async () => {
    render(<Harness previews={[{ width: 48, height: 48 }]} />);

    await waitFor(() => {
      expect(document.querySelector('cropper-viewer')).toBeInTheDocument();
    });

    expect(document.querySelector('cropper-viewer')).toHaveStyle({
      width: '48px',
      height: '48px',
    });
  });

  it('rounds the thumbnail when shape is circle', async () => {
    render(<Harness shape="circle" />);

    await waitFor(() => {
      expect(document.querySelector('cropper-viewer')).toBeInTheDocument();
    });

    expect(document.querySelector('cropper-viewer')).toHaveStyle({
      borderRadius: '50%',
    });
  });

  it('supports several previews sharing one cropper', async () => {
    render(
      <Harness
        previews={[
          { width: 128, height: 128 },
          { width: 48, height: 48 },
        ]}
      />
    );

    await waitFor(() => {
      expect(document.querySelectorAll('cropper-viewer')).toHaveLength(2);
    });

    const viewers = Array.from(document.querySelectorAll('cropper-viewer'));
    const selectors = viewers.map((viewer) => viewer.getAttribute('selection'));

    // Both mirror the same selection.
    expect(new Set(selectors).size).toBe(1);
  });

  it('keeps an id the consumer already set on the selection', async () => {
    function CustomIdHarness(): React.JSX.Element {
      const cropperRef = useRef<CropperRef>(null);
      return (
        <div>
          <Cropper ref={cropperRef} src="/test-image.jpg" />
          <CropperPreview cropperRef={cropperRef} width={64} height={64} />
        </div>
      );
    }

    const { rerender } = render(<CustomIdHarness />);
    const selection = document.querySelector('cropper-selection');
    selection?.setAttribute('id', 'my-own-id');
    rerender(<CustomIdHarness />);

    await waitFor(() => {
      expect(document.querySelector('cropper-viewer')).toBeInTheDocument();
    });

    expect(document.querySelector('cropper-selection')?.id).toBe('my-own-id');
  });

  it('does not re-render the React tree when the selection changes', async () => {
    const renderSpy = vi.fn();

    function CountingHarness(): React.JSX.Element {
      const cropperRef = useRef<CropperRef>(null);
      renderSpy();
      return (
        <div>
          <Cropper ref={cropperRef} src="/test-image.jpg" />
          <CropperPreview cropperRef={cropperRef} width={64} height={64} />
        </div>
      );
    }

    render(<CountingHarness />);

    await waitFor(() => {
      expect(document.querySelector('cropper-viewer')).toBeInTheDocument();
    });

    const rendersAfterMount = renderSpy.mock.calls.length;

    // Selection changes are what happen on every pointer move during a drag.
    const selection = document.querySelector('cropper-selection');
    for (let i = 0; i < 5; i += 1) {
      selection?.dispatchEvent(
        new CustomEvent('change', {
          detail: { x: i, y: i, width: 50, height: 50 },
        })
      );
    }

    // The viewer syncs in its shadow DOM, so React stays idle.
    expect(renderSpy.mock.calls.length).toBe(rendersAfterMount);
  });

  it('waits for the cropper-image to upgrade before mounting the viewer', async () => {
    // <cropper-viewer> dereferences `$image` on the source image as it
    // connects. Mounting before the custom element upgrades throws
    // "Cannot read properties of undefined (reading 'addEventListener')".
    const upgraded = { current: false };

    function LateUpgradeHarness(): React.JSX.Element {
      const cropperRef = useRef<CropperRef>(null);
      const guardedRef = {
        get current(): CropperRef | null {
          const api = cropperRef.current;
          if (!api) return null;

          return {
            ...api,
            getImage: () => {
              const image = api.getImage();
              if (!image || !upgraded.current) return null;
              return image;
            },
          } as CropperRef;
        },
      } as React.RefObject<CropperRef | null>;

      return (
        <div>
          <Cropper ref={cropperRef} src="/test-image.jpg" />
          <CropperPreview cropperRef={guardedRef} width={64} height={64} />
        </div>
      );
    }

    render(<LateUpgradeHarness />);

    // Still un-upgraded: the viewer must not be mounted yet.
    expect(document.querySelector('cropper-viewer')).not.toBeInTheDocument();
    expect(
      screen.getByTestId('cropper-preview-placeholder')
    ).toBeInTheDocument();

    upgraded.current = true;

    await waitFor(() => {
      expect(document.querySelector('cropper-viewer')).toBeInTheDocument();
    });
  });

  it('applies a custom className and styles', async () => {
    function StyledHarness(): React.JSX.Element {
      const cropperRef = useRef<CropperRef>(null);
      return (
        <div>
          <Cropper ref={cropperRef} src="/test-image.jpg" />
          <CropperPreview
            cropperRef={cropperRef}
            width={64}
            height={64}
            className="thumb"
            style={{ outlineWidth: '2px' }}
          />
        </div>
      );
    }

    render(<StyledHarness />);

    await waitFor(() => {
      expect(document.querySelector('cropper-viewer')).toBeInTheDocument();
    });

    const viewer = document.querySelector('cropper-viewer');
    expect(viewer).toHaveClass('thumb');
    expect(viewer).toHaveStyle({ outlineWidth: '2px' });
  });
});
