import { useRef, useState, useEffect } from 'react';
import { Cropper, useCropper, type CropperRef, type CropperBounds } from '../../../src';

function App(): JSX.Element {
  const cropperRef = useRef<CropperRef>(null);
  const [bounds, setBounds] = useState<CropperBounds | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageSrc, setImageSrc] = useState<string>(
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
  );

  const handleReady = (): void => {
    console.log('Cropper is ready!');
    updatePreview();
  };

  const updatePreview = async (): Promise<void> => {
    const canvas = await cropperRef.current?.getCroppedCanvas();
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      // Revoke previous URL to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    });
  };

  const handleChange = (): void => {
    const currentBounds = cropperRef.current?.getBounds();
    if (currentBounds) {
      setBounds(currentBounds);
    }
    updatePreview();
  };

  const handleReset = (): void => {
    cropperRef.current?.reset();
  };

  const handleClear = (): void => {
    cropperRef.current?.clear();
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>React Cropper 2 - Basic Example</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Using Component</h2>
        <div style={{ marginBottom: '1rem' }}>
          <Cropper
            ref={cropperRef}
            src={imageSrc}
            alt="Example image"
            crossOrigin="anonymous"
            aspectRatio={16 / 9}
            onReady={handleReady}
            onChange={handleChange}
            style={{ maxHeight: '500px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleClear}>Clear</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {bounds && (
            <div style={{
              padding: '1rem',
              background: '#f5f5f5',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              <strong>Current Bounds:</strong>
              <pre>{JSON.stringify(bounds, null, 2)}</pre>
            </div>
          )}

          {previewUrl && (
            <div style={{
              padding: '1rem',
              background: '#f5f5f5',
              borderRadius: '4px'
            }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Preview:</strong>
              <img
                src={previewUrl}
                alt="Cropped preview"
                style={{
                  maxWidth: '100%',
                  display: 'block',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h2>Using Hook</h2>
        <HookExample />
      </div>
    </div>
  );
}

function HookExample(): JSX.Element {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const {
    renderCropper,
    bounds,
    isReady,
    reset,
    clear,
    getCroppedCanvas
  } = useCropper({
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    alt: 'Nature',
    crossOrigin: 'anonymous',
    aspectRatio: 1,
    initialCoverage: 0.8,
    onReady: () => {
      console.log('Hook: Cropper ready!');
      updatePreview();
    },
    onChange: (e) => {
      console.log('Hook: Changed', e.detail);
      updatePreview();
    },
  });

  const updatePreview = async (): Promise<void> => {
    const canvas = await getCroppedCanvas();
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      // Revoke previous URL to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    });
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        {renderCropper({ style: { maxHeight: '400px' } })}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={reset}>Reset</button>
        <button onClick={clear}>Clear</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <div><strong>Ready:</strong> {isReady ? 'Yes' : 'No'}</div>
          {bounds && (
            <>
              <strong>Bounds:</strong>
              <pre>{JSON.stringify(bounds, null, 2)}</pre>
            </>
          )}
        </div>

        {previewUrl && (
          <div style={{
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '4px'
          }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Preview:</strong>
            <img
              src={previewUrl}
              alt="Cropped preview"
              style={{
                maxWidth: '100%',
                display: 'block',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
