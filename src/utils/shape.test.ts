import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getSelectionShapeStyle,
  getShapeKey,
  isPathShape,
  polygonShape,
  resolveAspectRatio,
  resolveShape,
} from './shape';
import type { CropperShapeDefinition } from '../types';

const triangle: CropperShapeDefinition = {
  path: 'M 0.5 0 L 1 1 L 0 1 Z',
  viewBox: [0, 0, 1, 1],
};

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

  it('applies no style for custom shapes, which draw an overlay instead', () => {
    expect(getSelectionShapeStyle(resolveShape(triangle))).toBeUndefined();
  });
});

describe('resolveShape', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes built-in shapes through', () => {
    expect(resolveShape('rect')).toBe('rect');
    expect(resolveShape('circle')).toBe('circle');
  });

  it('keeps a viewBox tuple and defaults stretch to false', () => {
    expect(resolveShape(triangle)).toEqual({
      path: triangle.path,
      viewBox: [0, 0, 1, 1],
      stretch: false,
    });
  });

  it('parses the SVG viewBox string form, including a negative origin', () => {
    const shape = resolveShape({ path: 'M0 0Z', viewBox: '-12 -12 24 24' });

    expect(isPathShape(shape) && shape.viewBox).toEqual([-12, -12, 24, 24]);
  });

  it('accepts comma-separated viewBox strings', () => {
    const shape = resolveShape({ path: 'M0 0Z', viewBox: '0,0,100,50' });

    expect(isPathShape(shape) && shape.viewBox).toEqual([0, 0, 100, 50]);
  });

  it('trims the path', () => {
    const shape = resolveShape({ path: '  M0 0Z  ', viewBox: [0, 0, 1, 1] });

    expect(isPathShape(shape) && shape.path).toBe('M0 0Z');
  });

  it('keeps stretch when set', () => {
    const shape = resolveShape({ ...triangle, stretch: true });

    expect(isPathShape(shape) && shape.stretch).toBe(true);
  });

  it.each([
    ['empty', ''],
    ['whitespace', '   '],
    ['not starting with a moveto', 'L 1 1 Z'],
    ['not path data', 'circle'],
  ])('falls back to rect for a path that is %s', (_label, path) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(resolveShape({ path, viewBox: [0, 0, 1, 1] })).toBe('rect');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('falling back to shape="rect"')
    );
  });

  it.each<[string, [number, number, number, number] | string]>([
    ['zero width', [0, 0, 0, 1]],
    ['negative height', [0, 0, 1, -1]],
    ['NaN', [0, 0, Number.NaN, 1]],
    ['Infinity', [0, 0, Number.POSITIVE_INFINITY, 1]],
    [
      'too few values',
      [0, 0, 1] as unknown as [number, number, number, number],
    ],
    ['an unparsable string', '0 0 wide tall'],
    ['a short string', '0 0 1'],
  ])('falls back to rect for a viewBox with %s', (_label, viewBox) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(resolveShape({ path: 'M0 0Z', viewBox })).toBe('rect');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Falling back to shape="rect"')
    );
  });
});

describe('getShapeKey', () => {
  it('is stable for equal shapes with different identities', () => {
    expect(getShapeKey({ ...triangle })).toBe(getShapeKey({ ...triangle }));
  });

  it('treats an omitted stretch as false', () => {
    expect(getShapeKey(triangle)).toBe(
      getShapeKey({ ...triangle, stretch: false })
    );
  });

  it('differs when the geometry changes', () => {
    expect(getShapeKey(triangle)).not.toBe(
      getShapeKey({ ...triangle, viewBox: [0, 0, 2, 1] })
    );
  });

  it('uses the name for built-in shapes', () => {
    expect(getShapeKey('circle')).toBe('circle');
  });
});

describe('resolveAspectRatio for custom shapes', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wide = resolveShape({ path: 'M0 0Z', viewBox: [-5, -5, 200, 100] });

  it('locks to the viewBox ratio, ignoring the origin', () => {
    expect(resolveAspectRatio(wide, undefined)).toBe(2);
  });

  it('warns when it overrides a conflicting aspect ratio', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(resolveAspectRatio(wide, 1)).toBe(2);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Set stretch: true')
    );
  });

  it('stays quiet when the aspect ratio agrees, within float noise', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const third = resolveShape({ path: 'M0 0Z', viewBox: [0, 0, 1, 3] });

    resolveAspectRatio(third, 1 / 3 + 1e-12);

    expect(warn).not.toHaveBeenCalled();
  });

  it('passes the aspect ratio through when the shape stretches', () => {
    const stretchy = resolveShape({ ...triangle, stretch: true });

    expect(resolveAspectRatio(stretchy, 16 / 9)).toBe(16 / 9);
    expect(resolveAspectRatio(stretchy, undefined)).toBeUndefined();
  });
});

describe('polygonShape', () => {
  it('builds a closed path in the unit square', () => {
    expect(
      polygonShape([
        [0.5, 0],
        [1, 1],
        [0, 1],
      ])
    ).toEqual({ path: 'M 0.5 0 L 1 1 L 0 1 Z', viewBox: [0, 0, 1, 1] });
  });

  it('produces a shape that resolves without falling back', () => {
    const shape = resolveShape(
      polygonShape([
        [0, 0],
        [1, 0],
        [0.5, 1],
      ])
    );

    expect(isPathShape(shape)).toBe(true);
  });

  it('rejects fewer than 3 points', () => {
    expect(() =>
      polygonShape([
        [0, 0],
        [1, 1],
      ])
    ).toThrow('at least 3 points');
  });

  it('rejects points outside 0–1', () => {
    expect(() =>
      polygonShape([
        [0, 0],
        [1.5, 0],
        [0, 1],
      ])
    ).toThrow('within 0–1; got [1.5, 0]');
  });

  it('rejects non-finite points', () => {
    expect(() =>
      polygonShape([
        [0, 0],
        [Number.NaN, 0],
        [0, 1],
      ])
    ).toThrow('within 0–1');
  });
});
