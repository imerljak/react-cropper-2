import { useState, useCallback } from 'react';
import { useCropper } from '../../../src';
import { ASPECT_RATIOS, r2, usePlayground } from './playground';
import { s, Btn } from './ui';
import { PlaygroundShell } from './PlaygroundShell';
import { ImageControls, SelectionControls } from './controls';

export function UseCropperPlayground() {
  const state = usePlayground();
  const [bx, setBx] = useState('');
  const [by, setBy] = useState('');
  const [bw, setBw] = useState('');
  const [bh, setBh] = useState('');

  const aspectRatioValue = ASPECT_RATIOS[state.knobs.aspectRatio];

  const {
    renderCropper,
    isReady,
    getBounds,
    setBounds,
    reset,
    clear,
    getCroppedCanvas,
    getImage,
    getSelection: getCropperSelection,
  } = useCropper({
    src: state.knobs.src,
    alt: 'Playground image',
    crossOrigin: 'anonymous',
    ...(aspectRatioValue !== undefined
      ? { aspectRatio: aspectRatioValue }
      : {}),
    initialCoverage: state.knobs.initialCoverage,
    background: state.knobs.background,
    rotatable: state.knobs.rotatable,
    scalable: state.knobs.scalable,
    skewable: state.knobs.skewable,
    translatable: state.knobs.translatable,
    movable: state.knobs.movable,
    resizable: state.knobs.resizable,
    zoomable: state.knobs.zoomable,
    multiple: state.knobs.multiple,
    outlined: state.knobs.outlined,
    grid: state.knobs.grid,
    onReady: (canvas) =>
      state.log('ready', {
        element: canvas.tagName.toLowerCase(),
        isReady: true,
      }),
    onChange: (e) =>
      state.log('change', {
        x: r2(e.detail.x),
        y: r2(e.detail.y),
        width: r2(e.detail.width),
        height: r2(e.detail.height),
      }),
    onCropStart: (e) =>
      state.log('cropstart', {
        action: e.detail.action,
        event: e.detail.relatedEvent.type,
      }),
    onCropMove: (e) => state.log('cropmove', { action: e.detail.action }),
    onCropEnd: (e) =>
      state.log('cropend', {
        action: e.detail.action,
        event: e.detail.relatedEvent.type,
      }),
    onTransform: (e) =>
      state.log('transform', {
        matrix: e.detail.matrix.map(r2),
        oldMatrix: e.detail.oldMatrix.map(r2),
      }),
  });

  const getCanvas = useCallback(async () => {
    const canvas = await getCroppedCanvas();
    state.log('action', {
      cmd: 'getCroppedCanvas',
      width: canvas?.width,
      height: canvas?.height,
    });
  }, [getCroppedCanvas, state]);

  const applyBounds = () => {
    const partial = {
      ...(bx !== '' && { x: parseFloat(bx) }),
      ...(by !== '' && { y: parseFloat(by) }),
      ...(bw !== '' && { width: parseFloat(bw) }),
      ...(bh !== '' && { height: parseFloat(bh) }),
    };
    setBounds(partial);
    state.log('action', { cmd: 'setBounds', ...partial });
  };

  return (
    <PlaygroundShell
      state={state}
      badge="Hook"
      title="useCropper"
      description={`Simplified hook API with renderCropper(). Ready: ${isReady ? '✓' : '…'}`}
      showGrid
      actions={
        <>
          <Btn
            label="Reset"
            onClick={() => {
              reset();
              state.log('action', { cmd: 'reset' });
            }}
          />
          <Btn
            label="Clear"
            variant="danger"
            onClick={() => {
              clear();
              state.log('action', { cmd: 'clear' });
            }}
          />
          <Btn
            label="Get Bounds"
            onClick={() =>
              state.log('action', { cmd: 'getBounds', result: getBounds() })
            }
          />
          <Btn label="Get Canvas" onClick={getCanvas} />
          <span style={s.divider} />
          <span style={s.setBoundsLabel}>Set bounds:</span>
          {(
            [
              ['x', bx, setBx],
              ['y', by, setBy],
              ['w', bw, setBw],
              ['h', bh, setBh],
            ] as const
          ).map(([lbl, val, set]) => (
            <label key={lbl} style={s.boundsField}>
              <span style={s.boundsLabel}>{lbl}</span>
              <input
                type="number"
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder="—"
                style={s.boundsInput}
              />
            </label>
          ))}
          <Btn label="Apply" onClick={applyBounds} />
        </>
      }
      controls={
        <>
          <ImageControls getImage={getImage} log={state.log} />
          <SelectionControls
            getSelection={getCropperSelection}
            log={state.log}
          />
        </>
      }
    >
      {renderCropper({ style: { height: 340, width: '100%' } })}
    </PlaygroundShell>
  );
}
