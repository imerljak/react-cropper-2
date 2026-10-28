/**
 * SSR-safe registration of the CropperJS custom elements.
 *
 * CropperJS 2.x defines its Custom Element classes (`class CropperElement
 * extends HTMLElement`) at module scope. Evaluating that module in Node — as
 * Next.js App Router, Remix and any RSC setup do — throws
 * `ReferenceError: HTMLElement is not defined` before any component renders.
 *
 * So the import has to stay out of the server's module graph entirely: a
 * static `import 'cropperjs'` is hoisted and evaluated unconditionally, which
 * is why registration is deferred to a guarded dynamic import instead.
 *
 * Loading asynchronously in the browser is safe. Custom elements upgrade
 * retroactively: markup parsed before `customElements.define()` is upgraded as
 * soon as the definition lands, and the hook's readiness probe already waits
 * for the element's methods to appear before reporting ready.
 */

/** Whether the current environment can host custom elements. */
export function isBrowserEnvironment(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof HTMLElement !== 'undefined' &&
    typeof window.customElements !== 'undefined'
  );
}

/** Deduplicates concurrent and repeated registration calls. */
let registration: Promise<void> | null = null;

/**
 * Loads CropperJS so its custom elements are defined.
 *
 * Resolves immediately without importing anything when run on the server,
 * leaving the elements undefined — nothing can render them there anyway.
 */
export function registerCropperElements(): Promise<void> {
  if (!isBrowserEnvironment()) {
    return Promise.resolve();
  }

  registration ??= import('cropperjs').then(() => undefined);

  return registration;
}

/** Test seam: drops the memoised registration promise. */
export function resetCropperElementsRegistration(): void {
  registration = null;
}
