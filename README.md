# react-cropper-2

> A modern React wrapper for CropperJS 2.x

[![npm version](https://img.shields.io/npm/v/react-cropper-2.svg)](https://www.npmjs.com/package/react-cropper-2)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚧 Work in Progress

This library is currently under active development. CropperJS 2.x introduced a complete rewrite using web components, and this library provides React-friendly bindings.

## Why react-cropper-2?

- **CropperJS 2.x Support**: The original `react-cropper` library only supports CropperJS 1.x
- **Modern Architecture**: Built on web standards with CropperJS 2.x web components
- **TypeScript First**: Full type safety and IDE autocomplete
- **React Patterns**: Hooks, refs, and React-friendly APIs
- **Multiple Selections**: Support for CropperJS 2.x advanced features

## Planned Features

- ✅ Core web component wrappers
- ✅ TypeScript definitions
- ✅ React hooks for cropper interactions
- ✅ High-level convenience components
- ✅ Comprehensive documentation
- ✅ Migration guide from react-cropper v1

## Installation

```bash
# Coming soon
npm install react-cropper-2 cropperjs@next
```

## Quick Start

```tsx
// Coming soon
import { Cropper } from 'react-cropper-2';

function App() {
  return (
    <Cropper
      src="/image.jpg"
      aspectRatio={16 / 9}
      onReady={(cropper) => console.log('Ready!')}
    />
  );
}
```

## Development

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Contributing

Contributions are welcome! This is an early-stage project and we're open to ideas and improvements.

## License

MIT © 2025

## Acknowledgments

- [CropperJS](https://github.com/fengyuanchen/cropperjs) - The underlying cropping library
- [react-cropper](https://github.com/react-cropper/react-cropper) - Inspiration from the v1 wrapper
