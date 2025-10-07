import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock CropperJS web component if needed
// This prevents errors when testing components that use cropper elements
if (typeof window !== 'undefined') {
  // Define custom element if it doesn't exist
  if (!customElements.get('cropper-canvas')) {
    class MockCropperCanvas extends HTMLElement {
      connectedCallback(): void {
        // Mock implementation
      }
    }
    customElements.define('cropper-canvas', MockCropperCanvas);
  }

  if (!customElements.get('cropper-selection')) {
    class MockCropperSelection extends HTMLElement {
      connectedCallback(): void {
        // Mock implementation
      }
    }
    customElements.define('cropper-selection', MockCropperSelection);
  }
}

// Extend Vitest matchers
expect.extend({
  // Add custom matchers here if needed
});
