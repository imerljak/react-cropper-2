import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Cropper, type CropperRef } from './Cropper';
import type { CropperShapeDefinition } from '../types';

/**
 * Test suite for Cropper component
 * Following TDD - tests written first, implementation follows
 */
describe('Cropper Component', () => {
  describe('Rendering', () => {
    it('should render cropper-canvas element', () => {
      render(<Cropper src="/test-image.jpg" />);

      const canvas = document.querySelector('cropper-canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should render image with correct src and alt', () => {
      render(<Cropper src="/test-image.jpg" alt="Test image" />);

      const img = screen.getByAltText('Test image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/test-image.jpg');
    });

    it('should render cropper-selection element', () => {
      render(<Cropper src="/test-image.jpg" />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Cropper src="/test-image.jpg" className="custom-cropper" />);

      const canvas = document.querySelector('cropper-canvas');
      expect(canvas).toHaveClass('custom-cropper');
    });

    it('should apply custom styles', () => {
      const style = { width: '500px', height: '400px' };
      render(<Cropper src="/test-image.jpg" style={style} />);

      const canvas = document.querySelector('cropper-canvas');
      expect(canvas).toHaveStyle({ width: '500px', height: '400px' });
    });
  });

  describe('Props Configuration', () => {
    it('should set aspect ratio on selection element', () => {
      render(<Cropper src="/test-image.jpg" aspectRatio={16 / 9} />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toHaveAttribute('aspect-ratio', String(16 / 9));
    });

    it('should set initial coverage', () => {
      render(<Cropper src="/test-image.jpg" initialCoverage={0.5} />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toHaveAttribute('initial-coverage', '0.5');
    });

    it('should configure canvas with rotatable property', () => {
      render(<Cropper src="/test-image.jpg" rotatable={false} />);

      const canvas = document.querySelector('cropper-canvas');
      // In React 19, false boolean attributes are not rendered
      expect(canvas).not.toHaveAttribute('rotatable');
    });

    it('should configure selection with movable property', () => {
      render(<Cropper src="/test-image.jpg" movable={false} />);

      const selection = document.querySelector('cropper-selection');
      // In React 19, false boolean attributes are not rendered
      expect(selection).not.toHaveAttribute('movable');
    });

    it('should configure selection with resizable property', () => {
      render(<Cropper src="/test-image.jpg" resizable={false} />);

      const selection = document.querySelector('cropper-selection');
      // In React 19, false boolean attributes are not rendered
      expect(selection).not.toHaveAttribute('resizable');
    });
  });

  describe('Event Handlers', () => {
    it('should call onReady when component mounts', async () => {
      const onReady = vi.fn();
      render(<Cropper src="/test-image.jpg" onReady={onReady} />);

      await waitFor(() => {
        expect(onReady).toHaveBeenCalledTimes(1);
      });
    });

    it('should expose a measurable image by the time onReady fires', async () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      let rectAtReady: DOMRect | undefined;

      render(
        <Cropper
          ref={ref}
          src="/test-image.jpg"
          onReady={() => {
            rectAtReady = ref.current.getImage()?.getBoundingClientRect();
          }}
        />
      );

      await waitFor(() => {
        expect(rectAtReady).toBeDefined();
      });

      expect(rectAtReady?.width).toBeGreaterThan(0);
      expect(rectAtReady?.height).toBeGreaterThan(0);
    });

    it('should attach onChange listener to selection element', () => {
      const onChange = vi.fn();
      render(<Cropper src="/test-image.jpg" onChange={onChange} />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toBeInTheDocument();

      // Dispatch custom event
      const event = new CustomEvent('change', {
        detail: { bounds: { x: 0, y: 0, width: 100, height: 100 } },
      });
      selection?.dispatchEvent(event);

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should attach onCropStart listener', () => {
      const onCropStart = vi.fn();
      render(<Cropper src="/test-image.jpg" onCropStart={onCropStart} />);

      const selection = document.querySelector('cropper-selection');
      const event = new CustomEvent('cropstart');
      selection?.dispatchEvent(event);

      expect(onCropStart).toHaveBeenCalledTimes(1);
    });

    it('should attach onCropMove listener', () => {
      const onCropMove = vi.fn();
      render(<Cropper src="/test-image.jpg" onCropMove={onCropMove} />);

      const selection = document.querySelector('cropper-selection');
      const event = new CustomEvent('cropmove');
      selection?.dispatchEvent(event);

      expect(onCropMove).toHaveBeenCalledTimes(1);
    });

    it('should attach onCropEnd listener', () => {
      const onCropEnd = vi.fn();
      render(<Cropper src="/test-image.jpg" onCropEnd={onCropEnd} />);

      const selection = document.querySelector('cropper-selection');
      const event = new CustomEvent('cropend');
      selection?.dispatchEvent(event);

      expect(onCropEnd).toHaveBeenCalledTimes(1);
    });

    it('should attach onTransform listener to image element', () => {
      const onTransform = vi.fn();
      render(<Cropper src="/test-image.jpg" onTransform={onTransform} />);

      const image = document.querySelector('cropper-image');
      const event = new CustomEvent('transform');
      image?.dispatchEvent(event);

      expect(onTransform).toHaveBeenCalledTimes(1);
    });

    it('should cleanup event listeners on unmount', () => {
      const onChange = vi.fn();
      const { unmount } = render(
        <Cropper src="/test-image.jpg" onChange={onChange} />
      );

      unmount();

      const selection = document.querySelector('cropper-selection');
      const event = new CustomEvent('change');
      selection?.dispatchEvent(event);

      // Should not be called after unmount
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Props Configuration', () => {
    it('should render cropper-grid by default', () => {
      render(<Cropper src="/test-image.jpg" />);

      const grid = document.querySelector('cropper-grid');
      expect(grid).toBeInTheDocument();
    });

    it('should not render cropper-grid when grid is false', () => {
      render(<Cropper src="/test-image.jpg" grid={false} />);

      const grid = document.querySelector('cropper-grid');
      expect(grid).not.toBeInTheDocument();
    });
  });

  describe('Ref Methods', () => {
    it('should expose getCanvas method via ref', () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current.getCanvas).toBeDefined();
      expect(typeof ref.current.getCanvas).toBe('function');
    });

    it('should expose getBounds method via ref', () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current.getBounds).toBeDefined();
      expect(typeof ref.current.getBounds).toBe('function');
    });

    it('should expose setBounds method via ref', () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current.setBounds).toBeDefined();
      expect(typeof ref.current.setBounds).toBe('function');
    });

    it('should expose reset method via ref', () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current.reset).toBeDefined();
      expect(typeof ref.current.reset).toBe('function');
    });

    it('should expose resetSelection method via ref', () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current.resetSelection).toBeDefined();
      expect(typeof ref.current.resetSelection).toBe('function');
    });

    it('should expose resetTransform method via ref', () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current.resetTransform).toBeDefined();
      expect(typeof ref.current.resetTransform).toBe('function');
    });

    it('should reset the image transform when reset is called via ref', async () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      const image = document.querySelector('cropper-image');
      const resetTransform = vi.spyOn(
        image as unknown as { $resetTransform: () => void },
        '$resetTransform'
      );

      await waitFor(() => {
        expect(ref.current.getImage()).not.toBeNull();
      });

      ref.current.reset();

      expect(resetTransform).toHaveBeenCalledTimes(1);
    });

    it('should expose clear method via ref', () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current.clear).toBeDefined();
      expect(typeof ref.current.clear).toBe('function');
    });

    it('should expose getSelection method via ref', () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current.getSelection).toBeDefined();
      expect(typeof ref.current.getSelection).toBe('function');
    });

    it('should expose getImage method via ref', () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current.getImage).toBeDefined();
      expect(typeof ref.current.getImage).toBe('function');
    });
  });

  describe('Shape', () => {
    it('renders a rectangular selection by default', () => {
      render(<Cropper src="/test-image.jpg" />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).not.toHaveStyle({ borderRadius: '50%' });
    });

    it('rounds the selection when shape is circle', () => {
      render(<Cropper src="/test-image.jpg" shape="circle" />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toHaveStyle({ borderRadius: '50%' });
    });

    it('forces a 1:1 aspect ratio for circular crops', () => {
      render(<Cropper src="/test-image.jpg" shape="circle" />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toHaveAttribute('aspect-ratio', '1');
    });

    it('overrides a conflicting aspect ratio for circular crops', () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      render(
        <Cropper src="/test-image.jpg" shape="circle" aspectRatio={16 / 9} />
      );

      const selection = document.querySelector('cropper-selection');
      expect(selection).toHaveAttribute('aspect-ratio', '1');
      expect(warn).toHaveBeenCalled();

      warn.mockRestore();
    });

    it('leaves the aspect ratio alone for rectangular crops', () => {
      render(<Cropper src="/test-image.jpg" aspectRatio={16 / 9} />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toHaveAttribute('aspect-ratio', String(16 / 9));
    });

    it('keeps the rectangular outline and grid for built-in shapes', () => {
      render(<Cropper src="/test-image.jpg" shape="circle" />);

      expect(document.querySelector('cropper-selection')).toHaveAttribute(
        'outlined'
      );
      expect(document.querySelector('cropper-grid')).toBeInTheDocument();
      expect(
        screen.queryByTestId('cropper-shape-overlay')
      ).not.toBeInTheDocument();
    });
  });

  describe('Custom shape', () => {
    const hexagon: CropperShapeDefinition = {
      path: 'M 25 0 L 75 0 L 100 50 L 75 100 L 25 100 L 0 50 Z',
      viewBox: '-10 -20 120 140',
    };

    function overlay(): Element | null {
      return screen.queryByTestId('cropper-shape-overlay');
    }

    it('draws the shape inside the selection, with its viewBox', () => {
      render(<Cropper src="/test-image.jpg" shape={hexagon} />);

      const svg = overlay();
      expect(svg?.parentElement?.tagName).toBe('CROPPER-SELECTION');
      expect(svg).toHaveAttribute('viewBox', '-10 -20 120 140');
      expect(svg?.querySelector('path')).toHaveAttribute('d', hexagon.path);
    });

    it('stretches with the selection without blocking drags or clipping its stroke', () => {
      render(<Cropper src="/test-image.jpg" shape={hexagon} />);

      const svg = overlay();
      expect(svg).toHaveAttribute('preserveAspectRatio', 'none');
      expect(svg).toHaveStyle({
        pointerEvents: 'none',
        overflow: 'visible',
        position: 'absolute',
      });
      expect(svg?.querySelector('path')).toHaveAttribute(
        'vector-effect',
        'non-scaling-stroke'
      );
    });

    it('lets consumers theme the outline colour', () => {
      render(<Cropper src="/test-image.jpg" shape={hexagon} />);

      expect(overlay()?.querySelector('path')).toHaveAttribute(
        'stroke',
        'var(--react-cropper-2-shape-stroke, #39f)'
      );
    });

    it('hides the overlay from assistive technology', () => {
      render(<Cropper src="/test-image.jpg" shape={hexagon} />);

      expect(overlay()).toHaveAttribute('aria-hidden', 'true');
    });

    it('locks the selection to the viewBox ratio', () => {
      render(<Cropper src="/test-image.jpg" shape={hexagon} />);

      expect(document.querySelector('cropper-selection')).toHaveAttribute(
        'aspect-ratio',
        String(120 / 140)
      );
    });

    it('honours aspectRatio when the shape stretches', () => {
      render(
        <Cropper
          src="/test-image.jpg"
          shape={{ ...hexagon, stretch: true }}
          aspectRatio={2}
        />
      );

      expect(document.querySelector('cropper-selection')).toHaveAttribute(
        'aspect-ratio',
        '2'
      );
    });

    it('turns off the rectangular outline and grid by default', () => {
      render(<Cropper src="/test-image.jpg" shape={hexagon} />);

      expect(document.querySelector('cropper-selection')).not.toHaveAttribute(
        'outlined'
      );
      expect(document.querySelector('cropper-grid')).not.toBeInTheDocument();
    });

    it('still shows the outline and grid when asked explicitly', () => {
      render(<Cropper src="/test-image.jpg" shape={hexagon} outlined grid />);

      expect(document.querySelector('cropper-selection')).toHaveAttribute(
        'outlined'
      );
      expect(document.querySelector('cropper-grid')).toBeInTheDocument();
    });

    it('falls back to a plain rectangle for an invalid shape', () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      render(
        <Cropper
          src="/test-image.jpg"
          shape={{ path: '', viewBox: '0 0 1 1' }}
        />
      );

      expect(overlay()).not.toBeInTheDocument();
      expect(document.querySelector('cropper-grid')).toBeInTheDocument();
      expect(warn).toHaveBeenCalledTimes(1);

      warn.mockRestore();
    });

    it('warns once for an inline shape, not on every render', () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      const { rerender } = render(
        <Cropper
          src="/test-image.jpg"
          shape={{ path: 'nope', viewBox: '0 0 1 1' }}
        />
      );
      rerender(
        <Cropper
          src="/test-image.jpg"
          shape={{ path: 'nope', viewBox: '0 0 1 1' }}
        />
      );

      expect(warn).toHaveBeenCalledTimes(1);

      warn.mockRestore();
    });

    it('keeps the ref methods stable across inline shape re-renders', () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      const { rerender } = render(
        <Cropper ref={ref} src="/test-image.jpg" shape={{ ...hexagon }} />
      );
      const first = ref.current.getCroppedBlob;

      rerender(
        <Cropper ref={ref} src="/test-image.jpg" shape={{ ...hexagon }} />
      );

      expect(ref.current.getCroppedBlob).toBe(first);
    });

    it('updates the overlay when the shape changes', () => {
      const { rerender } = render(
        <Cropper src="/test-image.jpg" shape={hexagon} />
      );

      rerender(
        <Cropper
          src="/test-image.jpg"
          shape={{ path: 'M 0 0 L 1 0 L 0 1 Z', viewBox: [0, 0, 1, 1] }}
        />
      );

      expect(overlay()).toHaveAttribute('viewBox', '0 0 1 1');
    });
  });

  describe('Export helpers', () => {
    it.each(['getCroppedBlob', 'getCroppedFile', 'getCroppedDataURL'] as const)(
      'exposes %s via ref',
      (method) => {
        const ref = { current: null } as unknown as React.RefObject<CropperRef>;
        render(<Cropper ref={ref} src="/test-image.jpg" />);

        expect(typeof ref.current[method]).toBe('function');
      }
    );
  });

  describe('Transform controls', () => {
    it.each([
      'rotate',
      'zoom',
      'setZoom',
      'flipHorizontal',
      'flipVertical',
    ] as const)('exposes %s via ref', (method) => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(typeof ref.current[method]).toBe('function');
    });

    it('rotates the image in degrees, not radians', async () => {
      const ref = { current: null } as unknown as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      await waitFor(() => {
        expect(ref.current.getImage()).not.toBeNull();
      });

      const image = ref.current.getImage();
      const rotateSpy = vi.fn();
      Object.assign(image as object, { $rotate: rotateSpy });

      ref.current.rotate(90);

      expect(rotateSpy).toHaveBeenCalledWith('90deg');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing alt text gracefully', () => {
      render(<Cropper src="/test-image.jpg" />);

      const img = document.querySelector('cropper-image');
      expect(img).toHaveAttribute('alt', '');
    });

    it('should handle undefined aspect ratio', () => {
      render(<Cropper src="/test-image.jpg" aspectRatio={undefined} />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toBeInTheDocument();
    });

    it('should use default initial coverage when not provided', () => {
      render(<Cropper src="/test-image.jpg" />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toHaveAttribute('initial-coverage', '0.8');
    });
  });
});
