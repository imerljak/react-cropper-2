import type { Meta, StoryObj } from '@storybook/react';
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

const sampleImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4';

export const Default: Story = {
  args: {
    src: sampleImage,
    alt: 'Sample landscape image',
    crossOrigin: 'anonymous',
    style: { maxHeight: '500px', width: '100%' },
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
          onReady={() => console.log('Cropper ready')}
          onChange={(e) => {
            console.log('Crop changed:', e.detail);
            setBounds(e.detail.bounds ?? null);
          }}
          onCropStart={() => console.log('Crop started')}
          onCropEnd={() => console.log('Crop ended')}
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
          onReady={updatePreview}
          onChange={updatePreview}
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
              console.log('Current bounds:', bounds);
              alert(JSON.stringify(bounds, null, 2));
            }}
          >
            Get Bounds
          </button>
          <button
            onClick={() => {
              cropperRef.current?.setBounds({ x: 50, y: 50, width: 200, height: 200 });
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
