import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { useCropper } from '../hooks/useCropper';
import type { CropperBounds } from '../types';

const meta = {
  title: 'Hooks/useCropper',
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
    const { renderCropper } = useCropper({
      src: sampleImage,
      alt: 'Sample image',
      crossOrigin: 'anonymous',
    });

    return renderCropper({ style: { maxHeight: '500px', width: '100%' } });
  },
};

export const WithAspectRatio: Story = {
  render: () => {
    const { renderCropper } = useCropper({
      src: sampleImage,
      alt: 'Sample image with 16:9 aspect ratio',
      crossOrigin: 'anonymous',
      aspectRatio: 16 / 9,
    });

    return renderCropper({ style: { maxHeight: '500px', width: '100%' } });
  },
};

export const SquareAspectRatio: Story = {
  render: () => {
    const { renderCropper } = useCropper({
      src: sampleImage,
      alt: 'Sample image with square aspect ratio',
      crossOrigin: 'anonymous',
      aspectRatio: 1,
    });

    return renderCropper({ style: { maxHeight: '500px', width: '100%' } });
  },
};

export const WithBoundsTracking: Story = {
  render: () => {
    const [bounds, setBounds] = useState<CropperBounds | null>(null);

    const { renderCropper, getBounds } = useCropper({
      src: sampleImage,
      alt: 'Sample image with bounds tracking',
      crossOrigin: 'anonymous',
      aspectRatio: 16 / 9,
      onChange: () => {
        // Use setTimeout to ensure the DOM has updated
        setTimeout(() => {
          const currentBounds = getBounds();
          setBounds(currentBounds);
        }, 0);
      },
    });

    return (
      <div>
        {renderCropper({ style: { maxHeight: '500px', width: '100%' } })}
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

    const updatePreview = async (canvas: HTMLCanvasElement | null): Promise<void> => {
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

    const { renderCropper, getCroppedCanvas } = useCropper({
      src: sampleImage,
      alt: 'Sample image with live preview',
      crossOrigin: 'anonymous',
      aspectRatio: 16 / 9,
      onReady: async () => {
        const canvas = await getCroppedCanvas();
        updatePreview(canvas);
      },
      onChange: async () => {
        const canvas = await getCroppedCanvas();
        updatePreview(canvas);
      },
    });

    return (
      <div>
        {renderCropper({ style: { maxHeight: '500px', width: '100%' } })}
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
    const { renderCropper, getBounds, setBounds, reset, clear } = useCropper({
      src: sampleImage,
      alt: 'Sample image with control buttons',
      crossOrigin: 'anonymous',
    });

    return (
      <div>
        {renderCropper({ style: { maxHeight: '500px', width: '100%' } })}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              const bounds = getBounds();
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
          <button onClick={() => reset()}>Reset</button>
          <button onClick={() => clear()}>Clear</button>
        </div>
      </div>
    );
  },
};

export const ReadOnly: Story = {
  render: () => {
    const { renderCropper } = useCropper({
      src: sampleImage,
      alt: 'Read-only cropper',
      crossOrigin: 'anonymous',
      movable: false,
      resizable: false,
      zoomable: false,
    });

    return renderCropper({ style: { maxHeight: '500px', width: '100%' } });
  },
};

export const SmallInitialCoverage: Story = {
  render: () => {
    const { renderCropper } = useCropper({
      src: sampleImage,
      alt: 'Sample image with small initial coverage',
      crossOrigin: 'anonymous',
      initialCoverage: 0.3,
    });

    return renderCropper({ style: { maxHeight: '500px', width: '100%' } });
  },
};

export const NoBackground: Story = {
  render: () => {
    const { renderCropper } = useCropper({
      src: sampleImage,
      alt: 'Cropper without background',
      crossOrigin: 'anonymous',
      background: false,
    });

    return renderCropper({ style: { maxHeight: '500px', width: '100%' } });
  },
};

export const WithCustomClassName: Story = {
  render: () => {
    const { renderCropper } = useCropper({
      src: sampleImage,
      alt: 'Cropper with custom class',
      crossOrigin: 'anonymous',
      aspectRatio: 1,
    });

    return renderCropper({
      className: 'custom-cropper',
      style: {
        maxHeight: '500px',
        width: '100%',
        border: '2px solid #007bff',
        borderRadius: '8px',
      },
    });
  },
};
