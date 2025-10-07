import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Cropper, type CropperRef } from './Cropper';

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
      expect(canvas).toHaveAttribute('rotatable', 'false');
    });

    it('should configure selection with movable property', () => {
      render(<Cropper src="/test-image.jpg" movable={false} />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toHaveAttribute('movable', 'false');
    });

    it('should configure selection with resizable property', () => {
      render(<Cropper src="/test-image.jpg" resizable={false} />);

      const selection = document.querySelector('cropper-selection');
      expect(selection).toHaveAttribute('resizable', 'false');
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

  describe('Ref Methods', () => {
    it('should expose getCanvas method via ref', () => {
      const ref = { current: null } as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current?.getCanvas).toBeDefined();
      expect(typeof ref.current?.getCanvas).toBe('function');
    });

    it('should expose getSelection method via ref', () => {
      const ref = { current: null } as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current?.getSelection).toBeDefined();
      expect(typeof ref.current?.getSelection).toBe('function');
    });

    it('should expose getBounds method via ref', () => {
      const ref = { current: null } as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current?.getBounds).toBeDefined();
      expect(typeof ref.current?.getBounds).toBe('function');
    });

    it('should expose setBounds method via ref', () => {
      const ref = { current: null } as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current?.setBounds).toBeDefined();
      expect(typeof ref.current?.setBounds).toBe('function');
    });

    it('should expose reset method via ref', () => {
      const ref = { current: null } as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current?.reset).toBeDefined();
      expect(typeof ref.current?.reset).toBe('function');
    });

    it('should expose clear method via ref', () => {
      const ref = { current: null } as React.RefObject<CropperRef>;
      render(<Cropper ref={ref} src="/test-image.jpg" />);

      expect(ref.current?.clear).toBeDefined();
      expect(typeof ref.current?.clear).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing alt text gracefully', () => {
      render(<Cropper src="/test-image.jpg" />);

      const img = document.querySelector('img');
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
