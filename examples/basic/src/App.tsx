import { useRef, useState } from 'react';
import { Cropper, useCropper, type CropperRef, type CropperBounds } from '../../../src';
// Import CropperJS web components
import 'cropperjs';

function App(): JSX.Element {
  const cropperRef = useRef<CropperRef>(null);
  const [bounds, setBounds] = useState<CropperBounds | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
  );

  const handleReady = (): void => {
    console.log('Cropper is ready!');
  };

  const handleChange = (): void => {
    const currentBounds = cropperRef.current?.getBounds();
    if (currentBounds) {
      setBounds(currentBounds);
    }
  };

  const handleReset = (): void => {
    cropperRef.current?.reset();
  };

  const handleClear = (): void => {
    cropperRef.current?.clear();
  };

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
      </div>

      <div>
        <h2>Using Hook</h2>
        <HookExample />
      </div>
    </div>
  );
}

function HookExample(): JSX.Element {
  const {
    canvasRef,
    selectionRef,
    bounds,
    isReady,
    reset,
    clear
  } = useCropper({
    onReady: () => console.log('Hook: Cropper ready!'),
    onChange: (e) => console.log('Hook: Changed', e.detail),
  });

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <cropper-canvas
          ref={canvasRef}
          style={{ maxHeight: '400px', display: 'block' }}
        >
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"
            alt="Nature"
          />
          <cropper-selection
            ref={selectionRef}
            initial-coverage="0.8"
            aspect-ratio={1}
            outlined
          />
        </cropper-canvas>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={reset}>Reset</button>
        <button onClick={clear}>Clear</button>
      </div>

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
    </div>
  );
}

export default App;
