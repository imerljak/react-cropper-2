import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
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

    const { renderCropper, getCroppedCanvas } = useCropper({
      src: sampleImage,
      alt: 'Sample image with live preview',
      crossOrigin: 'anonymous',
      aspectRatio: 16 / 9,
      onReady: () => {
        void getCroppedCanvas().then(updatePreview);
      },
      onChange: () => {
        void getCroppedCanvas().then(updatePreview);
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the cropper to initialize and preview to render
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Verify Preview heading is present
    const previewHeading = canvas.getByText('Preview:');
    await expect(previewHeading).toBeInTheDocument();

    // Verify the preview image is rendered
    const previewImage = canvas.getByAltText('Cropped preview');
    await expect(previewImage).toBeInTheDocument();
    await expect(previewImage).toHaveAttribute('src');
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the cropper to be ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify all control buttons are present
    const getBoundsButton = canvas.getByText('Get Bounds');
    const setBoundsButton = canvas.getByText('Set Bounds');
    const resetButton = canvas.getByText('Reset');
    const clearButton = canvas.getByText('Clear');

    await expect(getBoundsButton).toBeInTheDocument();
    await expect(setBoundsButton).toBeInTheDocument();
    await expect(resetButton).toBeInTheDocument();
    await expect(clearButton).toBeInTheDocument();

    // Test clicking Set Bounds button
    await userEvent.click(setBoundsButton);

    // Wait for bounds to update
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify cropper still exists after setBounds
    const cropperCanvas = canvasElement.querySelector('cropper-canvas');
    await expect(cropperCanvas).toBeInTheDocument();

    // Test Reset button
    await userEvent.click(resetButton);
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
