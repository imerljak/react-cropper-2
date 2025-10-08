# react-cropper-2

> A modern React wrapper for CropperJS 2.x

[![npm version](https://img.shields.io/npm/v/@imerljak/react-cropper-2.svg)](https://www.npmjs.com/package/@imerljak/react-cropper-2)
[![npm downloads](https://img.shields.io/npm/dm/@imerljak/react-cropper-2.svg)](https://www.npmjs.com/package/@imerljak/react-cropper-2)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@imerljak/react-cropper-2)](https://bundlephobia.com/package/@imerljak/react-cropper-2)
[![CI](https://github.com/imerljak/react-cropper-2/actions/workflows/ci.yml/badge.svg)](https://github.com/imerljak/react-cropper-2/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript-first React library that provides idiomatic React bindings for [CropperJS 2.x](https://github.com/fengyuanchen/cropperjs) web components.

## Features

- ✅ **CropperJS 2.x Support** - Built for the latest CropperJS web components
- ✅ **React 19 Compatible** - Full support for React 19.x
- ✅ **TypeScript First** - Complete type safety with strict mode
- ✅ **Three APIs** - Component, simplified hook, and advanced hook
- ✅ **Modern Architecture** - Built on web standards
- ✅ **Fully Tested** - 96%+ test coverage with 55 passing tests
- ✅ **Interactive Docs** - [Storybook documentation](https://imerljak.github.io/react-cropper-2/)

## Why react-cropper-2?

The original `react-cropper` library only supports CropperJS 1.x. CropperJS 2.x is a complete rewrite using modern web components, requiring new React bindings. This library provides three flexible APIs to work with CropperJS 2.x in React applications.

## Installation

```bash
npm install @imerljak/react-cropper-2 cropperjs@2
```

## Quick Start

### Using the Component (Recommended)

The simplest way to use the library:

```tsx
import { useRef } from 'react';
import { Cropper, type CropperRef } from '@imerljak/react-cropper-2';

function App() {
  const cropperRef = useRef<CropperRef>(null);

  const handleGetBounds = () => {
    const bounds = cropperRef.current?.getBounds();
    console.log('Crop bounds:', bounds);
  };

  return (
    <div>
      <Cropper
        ref={cropperRef}
        src="/image.jpg"
        alt="Crop me"
        crossOrigin="anonymous"
        aspectRatio={16 / 9}
        onReady={() => console.log('Cropper ready!')}
        onChange={(e) => console.log('Crop changed:', e.detail.bounds)}
      />
      <button onClick={handleGetBounds}>Get Bounds</button>
      <button onClick={() => cropperRef.current?.reset()}>Reset</button>
    </div>
  );
}
```

### Using the Hook

For more control and composition:

```tsx
import { useCropper } from '@imerljak/react-cropper-2';

function App() {
  const { renderCropper, bounds, reset, clear, getCroppedCanvas } = useCropper({
    src: '/image.jpg',
    alt: 'Crop me',
    crossOrigin: 'anonymous',
    aspectRatio: 16 / 9,
    onReady: () => console.log('Ready!'),
    onChange: (e) => console.log('Changed:', e.detail),
  });

  const handleExport = async () => {
    const canvas = await getCroppedCanvas();
    const url = canvas?.toDataURL('image/png');
    // Use the cropped image
  };

  return (
    <div>
      {renderCropper({ style: { maxHeight: '500px' } })}
      <div>
        {bounds && <pre>{JSON.stringify(bounds, null, 2)}</pre>}
      </div>
      <button onClick={reset}>Reset</button>
      <button onClick={clear}>Clear</button>
      <button onClick={handleExport}>Export</button>
    </div>
  );
}
```

### Advanced Usage

For maximum control, use the advanced hook:

```tsx
import { useCropperAdvanced } from '@imerljak/react-cropper-2';

function App() {
  const {
    canvasRef,
    selectionRef,
    bounds,
    isReady,
    getBounds,
    setBounds,
    reset,
    getCroppedCanvas,
  } = useCropperAdvanced({
    autoInitialize: true,
    onReady: (canvas) => console.log('Ready!', canvas),
    onChange: (e) => console.log('Changed:', e.detail),
  });

  return (
    <div>
      <cropper-canvas ref={canvasRef} background>
        <cropper-image
          src="/image.jpg"
          alt="Crop me"
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
      <button onClick={() => setBounds({ x: 50, y: 50, width: 200, height: 200 })}>
        Set Custom Bounds
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## API Documentation

### `<Cropper>` Component

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `src` | `string` | Image URL (required) |
| `alt` | `string` | Image alt text |
| `crossOrigin` | `'anonymous' \| 'use-credentials'` | CORS setting |
| `aspectRatio` | `number` | Aspect ratio constraint (e.g., 16/9) |
| `initialCoverage` | `number` | Initial crop coverage (0-1) |
| `background` | `boolean` | Show background (default: true) |
| `rotatable` | `boolean` | Enable rotation (default: true) |
| `scalable` | `boolean` | Enable scaling (default: true) |
| `translatable` | `boolean` | Enable translation (default: true) |
| `movable` | `boolean` | Enable moving selection (default: true) |
| `resizable` | `boolean` | Enable resizing selection (default: true) |
| `zoomable` | `boolean` | Enable zooming (default: true) |
| `outlined` | `boolean` | Show selection outline (default: true) |
| `onReady` | `(canvas: CropperCanvasElement) => void` | Callback when ready |
| `onChange` | `CropperEventHandler` | Callback when crop changes |
| `onCropStart` | `CropperEventHandler` | Callback when crop starts |
| `onCropMove` | `CropperEventHandler` | Callback during crop movement |
| `onCropEnd` | `CropperEventHandler` | Callback when crop ends |

#### Ref Methods

```tsx
interface CropperRef {
  getCanvas: () => CropperCanvasElement | null;
  getBounds: () => CropperBounds | null;
  setBounds: (bounds: Partial<CropperBounds>) => void;
  reset: () => void;
  clear: () => void;
  getCroppedCanvas: (options?) => Promise<HTMLCanvasElement | null>;
}
```

### `useCropper` Hook

Simplified hook that handles rendering for you.

```tsx
const {
  renderCropper,
  bounds,
  isReady,
  getBounds,
  setBounds,
  reset,
  clear,
  getCanvas,
  getSelection,
  getCroppedCanvas,
} = useCropper(options);
```

### `useCropperAdvanced` Hook

Advanced hook for maximum control. You manage rendering yourself.

```tsx
const {
  canvasRef,
  selectionRef,
  bounds,
  isReady,
  getBounds,
  setBounds,
  reset,
  clear,
  getCanvas,
  getSelection,
  getCroppedCanvas,
} = useCropperAdvanced(options);
```

## Live Examples

Check out the [interactive Storybook documentation](https://imerljak.github.io/react-cropper-2/) with live examples for:

- Basic cropping
- Different aspect ratios
- Custom styling
- Event handling
- All three API approaches
- Advanced configurations

## Development

```bash
# Install dependencies
npm install

# Start example app
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build library
npm run build

# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

## Project Structure

```
react-cropper-2/
├── src/
│   ├── components/
│   │   ├── Cropper.tsx              # Main component
│   │   └── Cropper.test.tsx         # Component tests
│   ├── hooks/
│   │   ├── useCropper.tsx           # Simplified hook
│   │   ├── useCropper.test.ts       # Hook tests
│   │   ├── useCropperAdvanced.ts    # Advanced hook
│   │   └── useCropperAdvanced.test.ts
│   ├── types/
│   │   ├── index.ts                 # TypeScript types
│   │   └── jsx.d.ts                 # JSX declarations
│   ├── stories/                     # Storybook stories
│   └── index.ts                     # Main export
├── examples/basic/                  # Example application
├── tests/setup.ts                   # Test configuration
└── dist/                            # Build output
```

## Requirements

- React 18.0.0 or higher (works with React 19)
- CropperJS 2.0.1 or higher
- TypeScript 5.6+ (for TypeScript projects)

## Browser Support

Supports all modern browsers that support:
- ES2020
- Web Components (Custom Elements)
- ES Modules

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT © 2025

## Acknowledgments

- [CropperJS](https://github.com/fengyuanchen/cropperjs) - The underlying cropping library
- [react-cropper](https://github.com/react-cropper/react-cropper) - Inspiration from the v1 wrapper

## Related Projects

- [CropperJS](https://github.com/fengyuanchen/cropperjs) - The underlying library (v2.x)
- [react-cropper](https://github.com/react-cropper/react-cropper) - React wrapper for CropperJS v1.x
