import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useRef, useState } from 'react';
import { Cropper, type CropperRef } from '../components/Cropper';
import type { CropperBounds } from '../types';

const meta = {
  title: 'Components/Cropper',
  component: Cropper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    aspectRatio: {
      control: 'number',
      description: 'Aspect ratio for the crop selection (e.g., 16/9, 1, 4/3)',
    },
    initialCoverage: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Initial coverage of the image (0-1)',
    },
    background: {
      control: 'boolean',
      description: 'Enable background rendering',
    },
    rotatable: {
      control: 'boolean',
      description: 'Enable rotation',
    },
    scalable: {
      control: 'boolean',
      description: 'Enable scaling',
    },
    skewable: {
      control: 'boolean',
      description: 'Enable skewing',
    },
    translatable: {
      control: 'boolean',
      description: 'Enable translation',
    },
    movable: {
      control: 'boolean',
      description: 'Enable selection movement',
    },
    resizable: {
      control: 'boolean',
      description: 'Enable selection resizing',
    },
    zoomable: {
      control: 'boolean',
      description: 'Enable zooming',
    },
    outlined: {
      control: 'boolean',
      description: 'Show outlined selection',
    },
  },
} satisfies Meta<typeof Cropper>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImage =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4';

export const Default: Story = {
  args: {
    src: sampleImage,
    alt: 'Sample landscape image',
    crossOrigin: 'anonymous',
    style: { maxHeight: '500px', width: '100%' },
  },
  play: async ({ canvasElement }) => {
    // Wait for the cropper to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify cropper web components are rendered
    const cropperCanvas = canvasElement.querySelector('cropper-canvas');
    const cropperImage = canvasElement.querySelector('cropper-image');
    const cropperSelection = canvasElement.querySelector('cropper-selection');

    await expect(cropperCanvas).toBeInTheDocument();
    await expect(cropperImage).toBeInTheDocument();
    await expect(cropperSelection).toBeInTheDocument();

    // Verify the image has the correct alt text
    await expect(cropperImage).toHaveAttribute('alt', 'Sample landscape image');
  },
};

export const SquareAspectRatio: Story = {
  args: {
    src: sampleImage,
    alt: 'Sample image with square crop',
    crossOrigin: 'anonymous',
    aspectRatio: 1,
    style: { maxHeight: '500px', width: '100%' },
  },
};

export const WideScreenAspectRatio: Story = {
  args: {
    src: sampleImage,
    alt: 'Sample image with 16:9 crop',
    crossOrigin: 'anonymous',
    aspectRatio: 16 / 9,
    style: { maxHeight: '500px', width: '100%' },
  },
};

export const PortraitAspectRatio: Story = {
  args: {
    src: sampleImage,
    alt: 'Sample image with 4:3 crop',
    crossOrigin: 'anonymous',
    aspectRatio: 4 / 3,
    style: { maxHeight: '500px', width: '100%' },
  },
};

export const SmallInitialCoverage: Story = {
  args: {
    src: sampleImage,
    alt: 'Sample image with small initial coverage',
    crossOrigin: 'anonymous',
    initialCoverage: 0.3,
    style: { maxHeight: '500px', width: '100%' },
  },
};

export const WithEventHandlers: Story = {
  render: (args) => {
    const [bounds, setBounds] = useState<CropperBounds | null>(null);

    return (
      <div>
        <Cropper
          {...args}
          onReady={() => {
            // eslint-disable-next-line no-console
            console.log('Cropper ready');
          }}
          onChange={(e) => {
            // eslint-disable-next-line no-console
            console.log('Crop changed:', e.detail);
            setBounds(e.detail.bounds ?? null);
          }}
          onCropStart={() => {
            // eslint-disable-next-line no-console
            console.log('Crop started');
          }}
          onCropEnd={() => {
            // eslint-disable-next-line no-console
            console.log('Crop ended');
          }}
        />
        {bounds && (
          <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            <strong>Current Bounds:</strong>
            <pre style={{ margin: 0 }}>{JSON.stringify(bounds, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  },
  args: {
    src: sampleImage,
    alt: 'Sample image with event handlers',
    crossOrigin: 'anonymous',
    aspectRatio: 16 / 9,
    style: { maxHeight: '500px', width: '100%' },
  },
};

export const WithPreview: Story = {
  render: (args) => {
    const cropperRef = useRef<CropperRef>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const updatePreview = async (): Promise<void> => {
      const canvas = await cropperRef.current?.getCroppedCanvas();
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

    return (
      <div>
        <Cropper
          {...args}
          ref={cropperRef}
          onReady={() => {
            void updatePreview();
          }}
          onChange={() => {
            void updatePreview();
          }}
        />
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
  args: {
    src: sampleImage,
    alt: 'Sample image with live preview',
    crossOrigin: 'anonymous',
    aspectRatio: 16 / 9,
    style: { maxHeight: '500px', width: '100%' },
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
  render: (args) => {
    const cropperRef = useRef<CropperRef>(null);

    return (
      <div>
        <Cropper {...args} ref={cropperRef} />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              const bounds = cropperRef.current?.getBounds();
              // eslint-disable-next-line no-console
              console.log('Current bounds:', bounds);
              alert(JSON.stringify(bounds, null, 2));
            }}
          >
            Get Bounds
          </button>
          <button
            onClick={() => {
              cropperRef.current?.setBounds({
                x: 50,
                y: 50,
                width: 200,
                height: 200,
              });
            }}
          >
            Set Bounds
          </button>
          <button onClick={() => cropperRef.current?.reset()}>Reset</button>
          <button onClick={() => cropperRef.current?.clear()}>Clear</button>
        </div>
      </div>
    );
  },
  args: {
    src: sampleImage,
    alt: 'Sample image with control buttons',
    crossOrigin: 'anonymous',
    style: { maxHeight: '500px', width: '100%' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the cropper to be ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find and verify all control buttons are present
    const getBoundsButton = canvas.getByText('Get Bounds');
    const setBoundsButton = canvas.getByText('Set Bounds');
    const resetButton = canvas.getByText('Reset');
    const clearButton = canvas.getByText('Clear');

    await expect(getBoundsButton).toBeInTheDocument();
    await expect(setBoundsButton).toBeInTheDocument();
    await expect(resetButton).toBeInTheDocument();
    await expect(clearButton).toBeInTheDocument();

    // Test Set Bounds button
    await userEvent.click(setBoundsButton);

    // Wait for bounds to update
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify cropper canvas exists
    const cropperCanvas = canvasElement.querySelector('cropper-canvas');
    await expect(cropperCanvas).toBeInTheDocument();
  },
};

export const ReadOnly: Story = {
  args: {
    src: sampleImage,
    alt: 'Read-only cropper',
    crossOrigin: 'anonymous',
    movable: false,
    resizable: false,
    zoomable: false,
    style: { maxHeight: '500px', width: '100%' },
  },
  play: async ({ canvasElement }) => {
    // Wait for the cropper to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify cropper components exist
    const cropperCanvas = canvasElement.querySelector('cropper-canvas');
    const cropperSelection = canvasElement.querySelector('cropper-selection');

    await expect(cropperCanvas).toBeInTheDocument();
    await expect(cropperSelection).toBeInTheDocument();

    // Verify that the selection has read-only attributes (not set when false)
    // When attributes are false, they are not rendered in the DOM
    await expect(cropperSelection).not.toHaveAttribute('movable');
    await expect(cropperSelection).not.toHaveAttribute('resizable');
    await expect(cropperSelection).not.toHaveAttribute('zoomable');
  },
};

export const NoBackground: Story = {
  args: {
    src: sampleImage,
    alt: 'Cropper without background',
    crossOrigin: 'anonymous',
    background: false,
    style: { maxHeight: '500px', width: '100%' },
  },
};
