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
      x = 10;
      y = 20;
      width = 100;
      height = 80;
      aspectRatio = 0;
      initialAspectRatio = 0;
      initialCoverage = 0.8;

      connectedCallback(): void {
        // Mock implementation
      }

      $change(): this {
        return this;
      }

      $reset(): this {
        return this;
      }

      $clear(): this {
        return this;
      }

      $center(): this {
        return this;
      }

      $move(): this {
        return this;
      }

      $moveTo(): this {
        return this;
      }

      $resize(): this {
        return this;
      }

      $zoom(): this {
        return this;
      }

      $toCanvas(): Promise<HTMLCanvasElement> {
        return Promise.resolve(document.createElement('canvas'));
      }
    }
    customElements.define('cropper-selection', MockCropperSelection);
  }
}

// Extend Vitest matchers
expect.extend({
  // Add custom matchers here if needed
});
