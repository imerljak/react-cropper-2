/**
 * react-cropper-2
 * A modern React wrapper for CropperJS 2.x web components
 */

// Import CropperJS to register web components globally
import 'cropperjs';

// Main component
export { Cropper } from './components/Cropper';
export type { CropperProps, CropperRef } from './components/Cropper';

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

// Types
export type {
  CropperBounds,
  TransformMatrix,
  ImageSize,
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
