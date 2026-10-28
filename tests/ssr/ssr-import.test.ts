import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Regression tests for SSR support.
 *
 * These run in a real Node environment (no jsdom), which is the condition that
 * used to break: CropperJS subclasses HTMLElement at module scope, so merely
 * importing the package on a server threw `HTMLElement is not defined`.
 *
 * They exercise the built output rather than the sources, because the failure
 * is a property of what consumers actually install.
 */
describe('SSR compatibility', () => {
  const distDir = resolve(__dirname, '../../dist');
  const esmEntry = resolve(distDir, 'index.js');
  const cjsEntry = resolve(distDir, 'index.cjs');

  const requireBuild = (entry: string): void => {
    if (!existsSync(entry)) {
      throw new Error(
        `Missing build output: ${entry}. Run \`npm run build\` before this suite.`
      );
    }
  };

  /** Imports the entry in a clean Node process with no DOM globals. */
  const importInNode = (entry: string): string =>
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
        if (typeof window !== 'undefined') {
          throw new Error('expected a DOM-free environment');
        }
        const mod = await import(${JSON.stringify(entry)});
        // Cropper is a forwardRef object, not a plain function.
        if (!mod.Cropper) {
          throw new Error('Cropper export missing');
        }
        process.stdout.write(Object.keys(mod).sort().join(','));
        `,
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    );

  it('imports the ESM build in Node without throwing', () => {
    requireBuild(esmEntry);

    expect(() => importInNode(esmEntry)).not.toThrow();
  });

  it('imports the CJS build in Node without throwing', () => {
    requireBuild(cjsEntry);

    expect(() => importInNode(cjsEntry)).not.toThrow();
  });

  it('exposes its public API when imported on the server', () => {
    requireBuild(esmEntry);

    const exportNames = importInNode(esmEntry).split(',');

    expect(exportNames).toEqual(
      expect.arrayContaining([
        'Cropper',
        'useCropper',
        'useCropperAdvanced',
        'registerCropperElements',
        'isBrowserEnvironment',
      ])
    );
  });

  it('does not register custom elements on the server', () => {
    requireBuild(esmEntry);

    const output = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
        const mod = await import(${JSON.stringify(esmEntry)});
        // Registration must be a no-op without a DOM, not a crash.
        await mod.registerCropperElements();
        process.stdout.write(String(mod.isBrowserEnvironment()));
        `,
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    );

    expect(output).toBe('false');
  });

  it("marks the published bundles with the 'use client' directive", () => {
    requireBuild(esmEntry);
    requireBuild(cjsEntry);

    expect(readFileSync(esmEntry, 'utf8').trimStart()).toMatch(
      /^['"]use client['"]/
    );
    expect(readFileSync(cjsEntry, 'utf8').trimStart()).toMatch(
      /^['"]use client['"]/
    );
  });
});
