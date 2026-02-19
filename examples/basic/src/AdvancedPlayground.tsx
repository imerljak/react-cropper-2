import { useState, useCallback } from 'react';
import { useCropperAdvanced } from '../../../src';
import { ASPECT_RATIOS, r2, usePlayground } from './playground';
import { s, Btn } from './ui';
import { PlaygroundShell } from './PlaygroundShell';
import { ImageControls, SelectionControls } from './controls';

export function AdvancedPlayground() {
  const state = usePlayground();
  const [bx, setBx] = useState('');
  const [by, setBy] = useState('');
  const [bw, setBw] = useState('');
  const [bh, setBh] = useState('');

  const { canvasRef, selectionRef, imageRef, isReady, getBounds, setBounds, reset, clear, getCroppedCanvas } =
    useCropperAdvanced({
      autoInitialize: true,
      onReady: (canvas) => state.log('ready', { element: canvas.tagName.toLowerCase(), isReady: true }),
      onChange: (e) => state.log('change', { x: r2(e.detail.x), y: r2(e.detail.y), width: r2(e.detail.width), height: r2(e.detail.height) }),
      onCropStart: (e) => state.log('cropstart', { action: e.detail.action, event: e.detail.relatedEvent.type }),
      onCropMove: (e) => state.log('cropmove', { action: e.detail.action }),
      onCropEnd: (e) => state.log('cropend', { action: e.detail.action, event: e.detail.relatedEvent.type }),
      onTransform: (e) => state.log('transform', { matrix: e.detail.matrix.map(r2), oldMatrix: e.detail.oldMatrix.map(r2) }),
    });

  const getCanvas = useCallback(async () => {
    const canvas = await getCroppedCanvas();
    state.log('action', { cmd: 'getCroppedCanvas', width: canvas?.width, height: canvas?.height });
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
      badge="Advanced Hook"
      title="useCropperAdvanced"
      description={`Low-level hook — you compose the web components manually. Ready: ${isReady ? '✓' : '…'}`}
      actions={
        <>
          <Btn label="Reset" onClick={() => { reset(); state.log('action', { cmd: 'reset' }); }} />
          <Btn label="Clear" variant="danger" onClick={() => { clear(); state.log('action', { cmd: 'clear' }); }} />
          <Btn label="Get Bounds" onClick={() => state.log('action', { cmd: 'getBounds', result: getBounds() })} />
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
          <ImageControls getImage={() => imageRef.current} log={state.log} />
          <SelectionControls getSelection={() => selectionRef.current} log={state.log} />
        </>
      }
    >
      <cropper-canvas
        key={state.knobs.src}
        ref={canvasRef}
        style={{ height: 340, width: '100%', display: 'block' }}
        background={state.knobs.background}
      >
        <cropper-image
          ref={imageRef}
          src={state.knobs.src}
          alt="Playground image"
          crossorigin="anonymous"
          rotatable={state.knobs.rotatable}
          scalable={state.knobs.scalable}
          skewable={state.knobs.skewable}
          translatable={state.knobs.translatable}
        />
        <cropper-selection
          ref={selectionRef}
          initial-coverage={state.knobs.initialCoverage}
          aspect-ratio={ASPECT_RATIOS[state.knobs.aspectRatio]}
          movable={state.knobs.movable}
          resizable={state.knobs.resizable}
          zoomable={state.knobs.zoomable}
          multiple={state.knobs.multiple}
          outlined={state.knobs.outlined}
        >
          {state.knobs.grid && <cropper-grid role="grid" bordered covered />}
          <cropper-crosshair centered />
          <cropper-handle action="move" theme-color="rgba(255,255,255,0.35)" />
          <cropper-handle action="n-resize" />
          <cropper-handle action="e-resize" />
          <cropper-handle action="s-resize" />
          <cropper-handle action="w-resize" />
          <cropper-handle action="ne-resize" />
          <cropper-handle action="nw-resize" />
          <cropper-handle action="se-resize" />
          <cropper-handle action="sw-resize" />
        </cropper-selection>
      </cropper-canvas>
    </PlaygroundShell>
  );
}
