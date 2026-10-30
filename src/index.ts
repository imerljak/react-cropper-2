'use client';

/**
 * react-cropper-2
 * A modern React wrapper for CropperJS 2.x web components
 */

// Register the CropperJS web components, but only in the browser. A static
// `import 'cropperjs'` would be evaluated during SSR and throw, since the
// library subclasses HTMLElement at module scope.
import { registerCropperElements } from './register';

void registerCropperElements();

// Main component
export { Cropper } from './components/Cropper';
export type { CropperProps, CropperRef } from './components/Cropper';

// Live preview
export { CropperPreview } from './components/CropperPreview';
export type {
  CropperPreviewProps,
  CropperPreviewResize,
} from './components/CropperPreview';

// Hooks
export { useCropper } from './hooks/useCropper.tsx';
export type {
  UseCropperOptions,
  UseCropperReturn,
} from './hooks/useCropper.tsx';
export { useCropperAdvanced } from './hooks/useCropperAdvanced';
export type {
  UseCropperAdvancedOptions,
  UseCropperAdvancedReturn,
} from './hooks/useCropperAdvanced';

// SSR helpers
export { registerCropperElements, isBrowserEnvironment } from './register';

// Types
export type {
  CropperBounds,
  TransformMatrix,
  ImageSize,
  CropperShape,
  ExportOptions,
  CropperElement,
  CropperCanvasElement,
  CropperImageElement,
  CropperSelectionElement,
  CropperCanvasActionEvent,
  CropperCanvasActionStartEvent,
  CropperCanvasActionMoveEvent,
  CropperCanvasActionEndEvent,
  CropperSelectionChangeEvent,
  CropperImageTransformEvent,
  CropperEventHandler,
} from './types';
