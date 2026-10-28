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
- ✅ **React 19 Compatible** - Full support for React 18.x and 19.x
- ✅ **SSR Safe** - Works in Next.js App Router and Remix without `next/dynamic`
- ✅ **TypeScript First** - Complete type safety with strict mode
- ✅ **Three APIs** - Component, simplified hook, and advanced hook
- ✅ **Export Helpers** - Blob, File and data URL in one call
- ✅ **Circular Crops** - `shape="circle"` for avatars, masked on export
- ✅ **Live Previews** - `<CropperPreview />` thumbnails with no React re-renders
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
      <div>{bounds && <pre>{JSON.stringify(bounds, null, 2)}</pre>}</div>
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
          <cropper-handle
            action="move"
            theme-color="rgba(255, 255, 255, 0.35)"
          />
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
      <button
        onClick={() => setBounds({ x: 50, y: 50, width: 200, height: 200 })}
      >
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

| Prop              | Type                                     | Description                                                                                                  |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src`             | `string`                                 | Image URL (required)                                                                                         |
| `alt`             | `string`                                 | Image alt text                                                                                               |
| `crossOrigin`     | `'anonymous' \| 'use-credentials'`       | CORS setting                                                                                                 |
| `aspectRatio`     | `number`                                 | Aspect ratio constraint (e.g., 16/9)                                                                         |
| `initialCoverage` | `number`                                 | Initial crop coverage (0-1), relative to the canvas ([see note](#initialcoverage-is-relative-to-the-canvas)) |
| `shape`           | `'rect' \| 'circle'`                     | Selection shape ([see note](#circular-crops)). Default: `'rect'`                                             |
| `background`      | `boolean`                                | Show background (default: true)                                                                              |
| `rotatable`       | `boolean`                                | Enable rotation (default: true)                                                                              |
| `scalable`        | `boolean`                                | Enable scaling (default: true)                                                                               |
| `translatable`    | `boolean`                                | Enable translation (default: true)                                                                           |
| `movable`         | `boolean`                                | Enable moving selection (default: true)                                                                      |
| `resizable`       | `boolean`                                | Enable resizing selection (default: true)                                                                    |
| `zoomable`        | `boolean`                                | Enable zooming (default: true)                                                                               |
| `outlined`        | `boolean`                                | Show selection outline (default: true)                                                                       |
| `onReady`         | `(canvas: CropperCanvasElement) => void` | Callback when ready ([see note](#onready-and-measuring-the-image))                                           |
| `onChange`        | `CropperEventHandler`                    | Callback when crop changes                                                                                   |
| `onCropStart`     | `CropperEventHandler`                    | Callback when crop starts                                                                                    |
| `onCropMove`      | `CropperEventHandler`                    | Callback during crop movement                                                                                |
| `onCropEnd`       | `CropperEventHandler`                    | Callback when crop ends                                                                                      |

#### Ref Methods

```tsx
interface CropperRef {
  getCanvas: () => CropperCanvasElement | null;
  getSelection: () => CropperSelectionElement | null;
  getImage: () => CropperImageElement | null;
  getBounds: () => CropperBounds | null;
  setBounds: (bounds: Partial<CropperBounds>) => void;

  // Reset
  reset: () => void;
  resetSelection: () => void;
  resetTransform: () => void;
  clear: () => void;

  // Transform controls
  rotate: (degrees: number) => void;
  zoom: (ratio: number) => void;
  setZoom: (level: number) => void;
  flipHorizontal: () => void;
  flipVertical: () => void;

  // Export
  getCroppedCanvas: (options?) => Promise<HTMLCanvasElement | null>;
  getCroppedBlob: (options?) => Promise<Blob | null>;
  getCroppedFile: (filename: string, options?) => Promise<File | null>;
  getCroppedDataURL: (options?) => Promise<string | null>;
}
```

CropperJS stores the image transform (rotation, zoom, flip, translation) on
`<cropper-image>`, separately from the selection box. The three reset methods
target each independently:

| Method             | Selection | Image transform |
| ------------------ | --------- | --------------- |
| `reset()`          | ✅ reset  | ✅ reset        |
| `resetSelection()` | ✅ reset  | untouched       |
| `resetTransform()` | untouched | ✅ reset        |

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
  resetSelection,
  resetTransform,
  rotate,
  zoom,
  setZoom,
  flipHorizontal,
  flipVertical,
  clear,
  getCanvas,
  getSelection,
  getCroppedCanvas,
  getCroppedBlob,
  getCroppedFile,
  getCroppedDataURL,
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
  resetSelection,
  resetTransform,
  rotate,
  zoom,
  setZoom,
  flipHorizontal,
  flipVertical,
  clear,
  getCanvas,
  getSelection,
  getCroppedCanvas,
  getCroppedBlob,
  getCroppedFile,
  getCroppedDataURL,
} = useCropperAdvanced(options);
```

## Exporting

`getCroppedCanvas` returns a raw canvas. The export helpers wrap the usual
boilerplate and all return promises:

```tsx
const blob = await cropperRef.current?.getCroppedBlob({
  mimeType: 'image/webp',
});
const file = await cropperRef.current?.getCroppedFile('avatar.png');
const url = await cropperRef.current?.getCroppedDataURL({
  mimeType: 'image/jpeg',
  quality: 0.8,
});

// Ready for multipart upload
const body = new FormData();
if (file) body.append('avatar', file);
```

### `ExportOptions`

| Option      | Type                                          | Description                                              |
| ----------- | --------------------------------------------- | -------------------------------------------------------- |
| `mimeType`  | `'image/png' \| 'image/jpeg' \| 'image/webp'` | Output format. Default: `'image/png'`                    |
| `quality`   | `number`                                      | Encoder quality (0-1) for lossy formats. Default: `0.92` |
| `fillColor` | `string`                                      | Background painted behind the crop                       |

JPEG has no alpha channel, so transparent pixels would encode as black. A white
background is filled in automatically for JPEG unless you set `fillColor`.

Sizing options (`width`, `height`) can be passed alongside the encoding options.

## Transform controls

```tsx
cropperRef.current?.rotate(90); // degrees, not radians
cropperRef.current?.rotate(-90);
cropperRef.current?.zoom(0.1); // relative: +10%
cropperRef.current?.setZoom(2); // absolute: 2x natural scale
cropperRef.current?.flipHorizontal();
cropperRef.current?.flipVertical();
```

`rotate()` takes **degrees**. CropperJS itself reads a bare number as radians;
this wrapper converts for you.

Reset granularity:

| Method             | Selection | Image transform |
| ------------------ | --------- | --------------- |
| `reset()`          | reset     | reset           |
| `resetSelection()` | reset     | untouched       |
| `resetTransform()` | untouched | reset           |

## Live preview

`<CropperPreview />` mirrors the current crop as a thumbnail. It wraps
CropperJS's `<cropper-viewer>`, which syncs inside its own shadow DOM — so
dragging the selection updates every preview without re-rendering the React
tree.

```tsx
const cropperRef = useRef<CropperRef>(null);

<Cropper ref={cropperRef} src="/avatar.jpg" shape="circle" />
<CropperPreview cropperRef={cropperRef} width={128} height={128} />
<CropperPreview cropperRef={cropperRef} width={48} height={48} shape="circle" />
```

| Prop                  | Type                    | Description                             |
| --------------------- | ----------------------- | --------------------------------------- |
| `cropperRef`          | `RefObject<CropperRef>` | Ref of the cropper to mirror (required) |
| `width` / `height`    | `number`                | Thumbnail size in pixels (required)     |
| `shape`               | `'rect' \| 'circle'`    | Thumbnail shape. Default: `'rect'`      |
| `className` / `style` | —                       | Custom styling                          |

## Server-side rendering

The package is safe to import in Next.js App Router, Remix and other RSC
setups. Entrypoints carry `'use client'`, and the CropperJS custom elements are
registered only in the browser, so importing on the server is a no-op rather
than a crash. No `next/dynamic` wrapper is required.

```tsx
import {
  isBrowserEnvironment,
  registerCropperElements,
} from '@imerljak/react-cropper-2';
```

Both are exported if you need to trigger or check registration yourself.

## Notes

### Circular crops

`shape="circle"` rounds the selection on screen and masks exports to a centred
circle via a canvas clip. Pixels outside the circle stay transparent, so use
`image/png` or `image/webp` to preserve the round edge — JPEG will fill them.

It also **forces `aspectRatio={1}`**. A circular selection over a non-square box
would not match the exported image, so a conflicting `aspectRatio` is overridden
and a warning is logged in development.

### `initialCoverage` is relative to the canvas

`initialCoverage` sizes the selection against the **canvas**, not the image.
The canvas letterboxes images whose aspect ratio differs from its own, so
`initialCoverage={1}` selects the entire canvas — including the empty bars
beside the image — not the entire image.

For an 800×400 image in a 908×400 canvas, `initialCoverage={1}` yields a
908×400 selection with 54px of empty canvas on each side.

### `onReady` and measuring the image

`onReady` fires once the selection has valid bounds **and** the image has a
non-zero layout box, so every element it exposes is safe to measure
immediately — no polling required.

To open with the whole image selected, measure it in `onReady` and set the
bounds yourself:

```tsx
const cropperRef = useRef<CropperRef>(null);

<Cropper
  ref={cropperRef}
  src="/image.jpg"
  onReady={(canvas) => {
    const image = cropperRef.current?.getImage();
    if (!image) return;

    const imageBox = image.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();

    cropperRef.current?.setBounds({
      x: imageBox.x - canvasBox.x,
      y: imageBox.y - canvasBox.y,
      width: imageBox.width,
      height: imageBox.height,
    });
  }}
/>;
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
│   │   └── CropperPreview.tsx       # Live thumbnail component
│   ├── hooks/
│   │   ├── useCropper.tsx           # Simplified hook
│   │   └── useCropperAdvanced.ts    # Advanced hook
│   ├── utils/
│   │   ├── canvas.ts                # Export encoding and masking
│   │   └── shape.ts                 # Shape / aspect-ratio resolution
│   ├── types/
│   │   ├── index.ts                 # TypeScript types
│   │   └── jsx.d.ts                 # JSX declarations
│   ├── register.ts                  # SSR-safe custom element registration
│   ├── stories/                     # Storybook stories
│   └── index.ts                     # Main export
├── examples/basic/                  # Example application
├── tests/
│   ├── setup.ts                     # Test configuration
│   └── ssr/                         # Node-environment SSR tests
└── dist/                            # Build output
```

## Requirements

- React 18.x or 19.x
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
