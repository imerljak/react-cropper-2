# Quick Start Guide

## Installation

```bash
npm install
```

## Development

Start the example app to see the library in action:

```bash
npm run dev
```

This will open http://localhost:3000 with example usage of both the component and hook approaches.

## Testing (TDD)

Run tests in watch mode:

```bash
npm test
```

Or with the interactive UI:

```bash
npm run test:ui
```

Current status: **42/49 tests passing** (7 intentionally failing for TDD)

## Building

Build the library:

```bash
npm run build
```

Output will be in `dist/`:
- `index.js` - ESM build
- `index.cjs` - CommonJS build
- `index.d.ts` - TypeScript definitions

## Code Quality

```bash
# Check everything
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm run format:check  # Prettier

# Auto-fix
npm run lint:fix
npm run format
```

## Project Structure

```
src/
├── components/
│   ├── Cropper.tsx          # Main component
│   └── Cropper.test.tsx     # Tests (25 passing ✅)
├── hooks/
│   ├── useCropper.ts        # React hook
│   └── useCropper.test.ts   # Tests (17/24 passing, 7 TDD)
├── types/
│   ├── index.ts             # Type definitions
│   └── jsx.d.ts             # JSX declarations
└── index.ts                 # Main export

examples/basic/              # Example app
tests/setup.ts               # Test config
```

## Usage Examples

### Using the Component

```tsx
import { useRef } from 'react';
import { Cropper, type CropperRef } from 'react-cropper-2';

function App() {
  const cropperRef = useRef<CropperRef>(null);

  const handleCrop = () => {
    const bounds = cropperRef.current?.getBounds();
    console.log('Crop bounds:', bounds);
  };

  return (
    <div>
      <Cropper
        ref={cropperRef}
        src="/path/to/image.jpg"
        aspectRatio={16 / 9}
        onReady={(canvas) => console.log('Cropper ready!')}
        onChange={(e) => console.log('Changed:', e.detail.bounds)}
      />
      <button onClick={handleCrop}>Get Bounds</button>
      <button onClick={() => cropperRef.current?.reset()}>Reset</button>
    </div>
  );
}
```

### Using the Hook

```tsx
import { useCropper } from 'react-cropper-2';

function App() {
  const {
    canvasRef,
    selectionRef,
    bounds,
    isReady,
    reset,
    clear
  } = useCropper({
    onReady: () => console.log('Ready!'),
    onChange: (e) => console.log('Changed:', e.detail),
  });

  return (
    <div>
      <cropper-canvas ref={canvasRef}>
        <img src="/path/to/image.jpg" alt="Crop me" />
        <cropper-selection
          ref={selectionRef}
          aspect-ratio={1}
          initial-coverage={0.8}
        />
      </cropper-canvas>

      <div>
        Status: {isReady ? 'Ready' : 'Loading...'}
        {bounds && <pre>{JSON.stringify(bounds, null, 2)}</pre>}
      </div>

      <button onClick={reset}>Reset</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}
```

## Key Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, module config |
| `tsconfig.json` | TypeScript strict mode config |
| `vite.config.ts` | Library build (ESM + CJS) |
| `vitest.config.ts` | Test configuration |
| `.eslintrc.cjs` | Linting rules |
| `.prettierrc` | Code formatting |

## Next Steps

1. Review the test files to understand expected behavior
2. Fix the 7 failing tests (TDD approach)
3. Add more tests for edge cases
4. Expand the example app
5. Add CI/CD pipeline

## Getting Help

- Check `SETUP_SUMMARY.md` for detailed documentation
- Review test files for usage examples
- See `examples/basic/` for working implementation
- All source files have JSDoc comments

---

Happy coding! 🚀
