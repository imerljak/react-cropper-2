import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  isBrowserEnvironment,
  registerCropperElements,
  resetCropperElementsRegistration,
} from './register';

describe('register', () => {
  afterEach(() => {
    resetCropperElementsRegistration();
    vi.unstubAllGlobals();
  });

  describe('isBrowserEnvironment', () => {
    it('reports true in a DOM environment', () => {
      expect(isBrowserEnvironment()).toBe(true);
    });

    it('reports false when window is absent', () => {
      vi.stubGlobal('window', undefined);

      expect(isBrowserEnvironment()).toBe(false);
    });

    it('reports false when custom elements are unavailable', () => {
      vi.stubGlobal('window', {});

      expect(isBrowserEnvironment()).toBe(false);
    });
  });

  describe('registerCropperElements', () => {
    it('defines the cropper custom elements in the browser', async () => {
      await registerCropperElements();

      expect(customElements.get('cropper-canvas')).toBeDefined();
      expect(customElements.get('cropper-image')).toBeDefined();
      expect(customElements.get('cropper-selection')).toBeDefined();
    });

    it('resolves without importing anything on the server', async () => {
      vi.stubGlobal('window', undefined);

      await expect(registerCropperElements()).resolves.toBeUndefined();
    });

    it('registers once across repeated calls', async () => {
      const first = registerCropperElements();
      const second = registerCropperElements();

      expect(first).toBe(second);
      await expect(first).resolves.toBeUndefined();
    });
  });
});
