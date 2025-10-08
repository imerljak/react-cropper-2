/**
 * react-cropper-2
 * A modern React wrapper for CropperJS 2.x web components
 */

// Main component
export { Cropper } from './components/Cropper';
export type { CropperProps, CropperRef } from './components/Cropper';

// Hooks
export { useCropper } from './hooks/useCropper.tsx';
export type { UseCropperOptions, UseCropperReturn } from './hooks/useCropper.tsx';
export { useCropperAdvanced } from './hooks/useCropperAdvanced';
export type { UseCropperAdvancedOptions, UseCropperAdvancedReturn } from './hooks/useCropperAdvanced';

// Types
export type {
  CropperBounds,
  CropperTransform,
  CropperCanvasElement,
  CropperImageElement,
  CropperSelectionElement,
  CropperEventDetail,
  CropperEvent,
  CropperEventHandler,
} from './types';
