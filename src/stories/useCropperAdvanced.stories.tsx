import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useCropperAdvanced } from '../hooks/useCropperAdvanced';
import type { CropperBounds, TransformMatrix } from '../types';

const meta = {
  title: 'Hooks/useCropperAdvanced',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4';

export const Default: Story = {
  render: () => {
    const { canvasRef, selectionRef, imageRef } = useCropperAdvanced({
      autoInitialize: true,
    });

    return (
      <cropper-canvas ref={canvasRef} style={{ maxHeight: '500px', width: '100%' }} background>
        <cropper-image
          ref={imageRef}
          src={sampleImage}
          alt="Sample image"
          crossorigin="anonymous"
          rotatable
          scalable
          translatable
        />
        <cropper-selection
          ref={selectionRef}
          initial-coverage={0.8}
          movable
          resizable
          zoomable
          outlined
        >
          <cropper-grid role="grid" bordered covered />
          <cropper-crosshair centered />
          <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)" />
          <cropper-handle action="n-resize" />
          <cropper-handle action="e-resize" />
          <cropper-handle action="s-resize" />
          <cropper-handle action="w-resize" />
          <cropper-handle action="ne-resize" />
          <cropper-handle action="nw-resize" />
          <cropper-handle action="se-resize" />
          <cropper-handle action="sw-resize" />
        </cropper-selection>
      </cropper-canvas>
    );
  },
};

export const WithAspectRatio: Story = {
  render: () => {
    const { canvasRef, selectionRef, imageRef } = useCropperAdvanced({
      autoInitialize: true,
    });

    return (
      <cropper-canvas ref={canvasRef} style={{ maxHeight: '500px', width: '100%' }} background>
        <cropper-image
          ref={imageRef}
          src={sampleImage}
          alt="Sample image with 16:9 aspect ratio"
          crossorigin="anonymous"
          rotatable
          scalable
          translatable
        />
        <cropper-selection
          ref={selectionRef}
          aspect-ratio={16 / 9}
          initial-coverage={0.8}
          movable
          resizable
          zoomable
          outlined
        >
          <cropper-grid role="grid" bordered covered />
          <cropper-crosshair centered />
          <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)" />
          <cropper-handle action="n-resize" />
          <cropper-handle action="e-resize" />
          <cropper-handle action="s-resize" />
          <cropper-handle action="w-resize" />
          <cropper-handle action="ne-resize" />
          <cropper-handle action="nw-resize" />
          <cropper-handle action="se-resize" />
          <cropper-handle action="sw-resize" />
        </cropper-selection>
      </cropper-canvas>
    );
  },
};

export const WithBoundsTracking: Story = {
  render: () => {
    const [bounds, setBounds] = useState<CropperBounds | null>(null);

    const { canvasRef, selectionRef, imageRef, getBounds } = useCropperAdvanced({
      autoInitialize: true,
      onChange: () => {
        const currentBounds = getBounds();
        setBounds(currentBounds);
      },
    });

    return (
      <div>
        <cropper-canvas ref={canvasRef} style={{ maxHeight: '500px', width: '100%' }} background>
          <cropper-image
            ref={imageRef}
            src={sampleImage}
            alt="Sample image with bounds tracking"
            crossorigin="anonymous"
            rotatable
            scalable
            translatable
          />
          <cropper-selection
            ref={selectionRef}
            aspect-ratio={16 / 9}
            initial-coverage={0.8}
            movable
            resizable
            zoomable
            outlined
          >
            <cropper-grid role="grid" bordered covered />
            <cropper-crosshair centered />
            <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)" />
            <cropper-handle action="n-resize" />
            <cropper-handle action="e-resize" />
            <cropper-handle action="s-resize" />
            <cropper-handle action="w-resize" />
            <cropper-handle action="ne-resize" />
            <cropper-handle action="nw-resize" />
            <cropper-handle action="se-resize" />
            <cropper-handle action="sw-resize" />
          </cropper-selection>
        </cropper-canvas>
        {bounds && (
          <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            <strong>Current Bounds:</strong>
            <pre style={{ margin: 0 }}>{JSON.stringify(bounds, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  },
};

export const WithPreview: Story = {
  render: () => {
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const updatePreview = (canvas: HTMLCanvasElement | null): void => {
      if (!canvas) return;

      canvas.toBlob((blob) => {
        if (!blob) return;
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      });
    };

    const { canvasRef, selectionRef, imageRef, getCroppedCanvas } = useCropperAdvanced({
      autoInitialize: true,
      onReady: () => {
        void getCroppedCanvas().then(updatePreview);
      },
      onChange: () => {
        void getCroppedCanvas().then(updatePreview);
      },
    });

    return (
      <div>
        <cropper-canvas ref={canvasRef} style={{ maxHeight: '500px', width: '100%' }} background>
          <cropper-image
            ref={imageRef}
            src={sampleImage}
            alt="Sample image with live preview"
            crossorigin="anonymous"
            rotatable
            scalable
            translatable
          />
          <cropper-selection
            ref={selectionRef}
            aspect-ratio={16 / 9}
            initial-coverage={0.8}
            movable
            resizable
            zoomable
            outlined
          >
            <cropper-grid role="grid" bordered covered />
            <cropper-crosshair centered />
            <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)" />
            <cropper-handle action="n-resize" />
            <cropper-handle action="e-resize" />
            <cropper-handle action="s-resize" />
            <cropper-handle action="w-resize" />
            <cropper-handle action="ne-resize" />
            <cropper-handle action="nw-resize" />
            <cropper-handle action="se-resize" />
            <cropper-handle action="sw-resize" />
          </cropper-selection>
        </cropper-canvas>
        {previewUrl && (
          <div style={{ marginTop: '1rem' }}>
            <strong>Preview:</strong>
            <div style={{ marginTop: '0.5rem' }}>
              <img
                src={previewUrl}
                alt="Cropped preview"
                style={{
                  maxWidth: '300px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const WithControlButtons: Story = {
  render: () => {
    const { canvasRef, selectionRef, imageRef, getBounds, setBounds, reset, clear } = useCropperAdvanced({
      autoInitialize: true,
    });

    return (
      <div>
        <cropper-canvas ref={canvasRef} style={{ maxHeight: '500px', width: '100%' }} background>
          <cropper-image
            ref={imageRef}
            src={sampleImage}
            alt="Sample image with control buttons"
            crossorigin="anonymous"
            rotatable
            scalable
            translatable
          />
          <cropper-selection
            ref={selectionRef}
            initial-coverage={0.8}
            movable
            resizable
            zoomable
            outlined
          >
            <cropper-grid role="grid" bordered covered />
            <cropper-crosshair centered />
            <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)" />
            <cropper-handle action="n-resize" />
            <cropper-handle action="e-resize" />
            <cropper-handle action="s-resize" />
            <cropper-handle action="w-resize" />
            <cropper-handle action="ne-resize" />
            <cropper-handle action="nw-resize" />
            <cropper-handle action="se-resize" />
            <cropper-handle action="sw-resize" />
          </cropper-selection>
        </cropper-canvas>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              const bounds = getBounds();
              // eslint-disable-next-line no-console
              console.log('Current bounds:', bounds);
              alert(JSON.stringify(bounds, null, 2));
            }}
          >
            Get Bounds
          </button>
          <button
            onClick={() => {
              setBounds({ x: 50, y: 50, width: 200, height: 200 });
            }}
          >
            Set Bounds
          </button>
          <button
            onClick={() => {
              reset();
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              clear();
            }}
          >
            Clear
          </button>
        </div>
      </div>
    );
  },
};

export const WithOnTransform: Story = {
  render: () => {
    const [transform, setTransform] = useState<TransformMatrix | null>(null);

    const { canvasRef, selectionRef, imageRef } = useCropperAdvanced({
      autoInitialize: true,
      onTransform: (e) => {
        setTransform(e.detail.matrix);
      },
    });

    return (
      <div>
        <cropper-canvas ref={canvasRef} style={{ maxHeight: '500px', width: '100%' }} background>
          <cropper-image
            ref={imageRef}
            src={sampleImage}
            alt="Sample image — rotate or zoom to see transform"
            crossorigin="anonymous"
            rotatable
            scalable
            translatable
          />
          <cropper-selection
            ref={selectionRef}
            initial-coverage={0.8}
            movable
            resizable
            zoomable
            outlined
          >
            <cropper-grid role="grid" bordered covered />
            <cropper-crosshair centered />
            <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)" />
            <cropper-handle action="n-resize" />
            <cropper-handle action="e-resize" />
            <cropper-handle action="s-resize" />
            <cropper-handle action="w-resize" />
            <cropper-handle action="ne-resize" />
            <cropper-handle action="nw-resize" />
            <cropper-handle action="se-resize" />
            <cropper-handle action="sw-resize" />
          </cropper-selection>
        </cropper-canvas>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          <strong>Transform matrix</strong>{' '}
          <span style={{ color: '#888' }}>(rotate or zoom the image)</span>
          <pre style={{ margin: '0.25rem 0 0' }}>
            {transform ? JSON.stringify(transform) : 'no transform yet'}
          </pre>
        </div>
      </div>
    );
  },
};

export const MinimalSetup: Story = {
  render: () => {
    const { canvasRef, selectionRef, imageRef } = useCropperAdvanced({
      autoInitialize: true,
    });

    return (
      <cropper-canvas ref={canvasRef} style={{ maxHeight: '500px', width: '100%' }}>
        <cropper-image ref={imageRef} src={sampleImage} alt="Minimal setup" crossorigin="anonymous" />
        <cropper-selection ref={selectionRef}>
          <cropper-grid role="grid" />
        </cropper-selection>
      </cropper-canvas>
    );
  },
};

export const CustomHandles: Story = {
  render: () => {
    const { canvasRef, selectionRef, imageRef } = useCropperAdvanced({
      autoInitialize: true,
    });

    return (
      <cropper-canvas ref={canvasRef} style={{ maxHeight: '500px', width: '100%' }} background>
        <cropper-image
          ref={imageRef}
          src={sampleImage}
          alt="Custom handles"
          crossorigin="anonymous"
          rotatable
          scalable
          translatable
        />
        <cropper-selection
          ref={selectionRef}
          aspect-ratio={1}
          initial-coverage={0.6}
          movable
          resizable
          zoomable
          outlined
        >
          <cropper-grid role="grid" bordered covered />
          <cropper-crosshair centered theme-color="#ff0000" />
          <cropper-handle action="move" theme-color="rgba(0, 123, 255, 0.5)" />
          <cropper-handle action="n-resize" plain />
          <cropper-handle action="e-resize" plain />
          <cropper-handle action="s-resize" plain />
          <cropper-handle action="w-resize" plain />
          <cropper-handle action="ne-resize" />
          <cropper-handle action="nw-resize" />
          <cropper-handle action="se-resize" />
          <cropper-handle action="sw-resize" />
        </cropper-selection>
      </cropper-canvas>
    );
  },
};

export const ReadOnly: Story = {
  render: () => {
    const { canvasRef, selectionRef, imageRef } = useCropperAdvanced({
      autoInitialize: true,
    });

    return (
      <cropper-canvas ref={canvasRef} style={{ maxHeight: '500px', width: '100%' }} background>
        <cropper-image
          ref={imageRef}
          src={sampleImage}
          alt="Read-only cropper"
          crossorigin="anonymous"
          rotatable={false}
          scalable={false}
          translatable={false}
        />
        <cropper-selection
          ref={selectionRef}
          initial-coverage={0.8}
          movable={false}
          resizable={false}
          zoomable={false}
          outlined
        >
          <cropper-grid role="grid" bordered covered />
        </cropper-selection>
      </cropper-canvas>
    );
  },
};
