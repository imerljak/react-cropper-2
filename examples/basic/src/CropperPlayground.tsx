import { useRef, useState, useCallback } from 'react';
import { Cropper, type CropperRef, type CropperCanvasElement } from '../../../src';
import { ASPECT_RATIOS, r2, usePlayground } from './playground';
import { s, Btn } from './ui';
import { PlaygroundShell } from './PlaygroundShell';
import { ImageControls, SelectionControls } from './controls';

export function CropperPlayground() {
  const state = usePlayground();
  const cropperRef = useRef<CropperRef>(null);
  const [bx, setBx] = useState('');
  const [by, setBy] = useState('');
  const [bw, setBw] = useState('');
  const [bh, setBh] = useState('');

  const aspectRatioValue = ASPECT_RATIOS[state.knobs.aspectRatio];

  const getCanvas = useCallback(async () => {
    const canvas = await cropperRef.current?.getCroppedCanvas();
    state.log('action', { cmd: 'getCroppedCanvas', width: canvas?.width, height: canvas?.height });
  }, [state]);

  const applyBounds = () => {
    const partial = {
      ...(bx !== '' && { x: parseFloat(bx) }),
      ...(by !== '' && { y: parseFloat(by) }),
      ...(bw !== '' && { width: parseFloat(bw) }),
      ...(bh !== '' && { height: parseFloat(bh) }),
    };
    cropperRef.current?.setBounds(partial);
    state.log('action', { cmd: 'setBounds', ...partial });
  };

  return (
    <PlaygroundShell
      state={state}
      badge="Component"
      title="<Cropper>"
      description="Fully-managed React component. Attach a ref to call imperative methods."
      showGrid
      actions={
        <>
          <Btn label="Reset" onClick={() => { cropperRef.current?.reset(); state.log('action', { cmd: 'reset' }); }} />
          <Btn label="Clear" variant="danger" onClick={() => { cropperRef.current?.clear(); state.log('action', { cmd: 'clear' }); }} />
          <Btn label="Get Bounds" onClick={() => state.log('action', { cmd: 'getBounds', result: cropperRef.current?.getBounds() })} />
          <Btn label="Get Canvas" onClick={getCanvas} />
          <span style={s.divider} />
          <span style={s.setBoundsLabel}>Set bounds:</span>
          {([['x', bx, setBx], ['y', by, setBy], ['w', bw, setBw], ['h', bh, setBh]] as const).map(([lbl, val, set]) => (
            <label key={lbl} style={s.boundsField}>
              <span style={s.boundsLabel}>{lbl}</span>
              <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder="—" style={s.boundsInput} />
            </label>
          ))}
          <Btn label="Apply" onClick={applyBounds} />
        </>
      }
      controls={
        <>
          <ImageControls getImage={() => cropperRef.current?.getImage() ?? null} log={state.log} />
          <SelectionControls getSelection={() => cropperRef.current?.getSelection() ?? null} log={state.log} />
        </>
      }
    >
      <Cropper
        key={state.knobs.src}
        ref={cropperRef}
        src={state.knobs.src}
        alt="Playground image"
        crossOrigin="anonymous"
        {...(aspectRatioValue !== undefined ? { aspectRatio: aspectRatioValue } : {})}
        initialCoverage={state.knobs.initialCoverage}
        background={state.knobs.background}
        rotatable={state.knobs.rotatable}
        scalable={state.knobs.scalable}
        skewable={state.knobs.skewable}
        translatable={state.knobs.translatable}
        movable={state.knobs.movable}
        resizable={state.knobs.resizable}
        zoomable={state.knobs.zoomable}
        multiple={state.knobs.multiple}
        outlined={state.knobs.outlined}
        grid={state.knobs.grid}
        style={{ height: 340, width: '100%' }}
        onReady={(canvas: CropperCanvasElement) => state.log('ready', { element: canvas.tagName.toLowerCase() })}
        onChange={(e) => state.log('change', { x: r2(e.detail.x), y: r2(e.detail.y), width: r2(e.detail.width), height: r2(e.detail.height) })}
        onCropStart={(e) => state.log('cropstart', { action: e.detail.action, event: e.detail.relatedEvent.type })}
        onCropMove={(e) => state.log('cropmove', { action: e.detail.action })}
        onCropEnd={(e) => state.log('cropend', { action: e.detail.action, event: e.detail.relatedEvent.type })}
        onTransform={(e) => state.log('transform', { matrix: e.detail.matrix.map(r2), oldMatrix: e.detail.oldMatrix.map(r2) })}
      />
    </PlaygroundShell>
  );
}
