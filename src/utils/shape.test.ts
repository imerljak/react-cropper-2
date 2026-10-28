import { describe, it, expect, vi, afterEach } from 'vitest';
import { getSelectionShapeStyle, resolveAspectRatio } from './shape';

describe('resolveAspectRatio', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes the aspect ratio through for rectangular crops', () => {
    expect(resolveAspectRatio('rect', 16 / 9)).toBe(16 / 9);
  });

  it('leaves an undefined aspect ratio undefined for rectangular crops', () => {
    expect(resolveAspectRatio('rect', undefined)).toBeUndefined();
  });

  it('forces 1:1 for circular crops', () => {
    expect(resolveAspectRatio('circle', undefined)).toBe(1);
  });

  it('overrides a conflicting aspect ratio for circular crops', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(resolveAspectRatio('circle', 16 / 9)).toBe(1);
  });

  it('warns when it overrides a conflicting aspect ratio', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    resolveAspectRatio('circle', 2);

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('shape="circle" forces aspectRatio={1}')
    );
  });

  it('stays quiet when the aspect ratio already agrees', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    resolveAspectRatio('circle', 1);

    expect(warn).not.toHaveBeenCalled();
  });

  it('stays quiet when no aspect ratio was requested', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    resolveAspectRatio('circle', undefined);

    expect(warn).not.toHaveBeenCalled();
  });

  it('works in browsers where process is not defined', () => {
    // Bundlers that do not shim `process` would otherwise throw
    // "ReferenceError: process is not defined" at render time.
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.stubGlobal('process', undefined);

    expect(() => resolveAspectRatio('circle', 2)).not.toThrow();
    expect(resolveAspectRatio('circle', 2)).toBe(1);

    vi.unstubAllGlobals();
  });

  it('suppresses the warning in production builds', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.stubGlobal('process', { env: { NODE_ENV: 'production' } });

    resolveAspectRatio('circle', 2);

    expect(warn).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});

describe('getSelectionShapeStyle', () => {
  it('rounds the selection for circular crops', () => {
    expect(getSelectionShapeStyle('circle')).toEqual({ borderRadius: '50%' });
  });

  it('applies no style for rectangular crops', () => {
    expect(getSelectionShapeStyle('rect')).toBeUndefined();
  });
});
