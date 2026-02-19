import { useState } from 'react';
import type {
  CropperImageElement,
  CropperSelectionElement,
} from '../../../src';
import type { PlaygroundState } from './playground';
import { s } from './ui';
import type { CSSProperties } from 'react';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const cs = {
  panel: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 12px',
  } as CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  } as CSSProperties,
  row: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  } as CSSProperties,
  sep: {
    display: 'inline-block',
    width: 1,
    height: 20,
    background: '#e2e8f0',
    margin: '0 2px',
  } as CSSProperties,
  stepLabel: {
    fontSize: '0.73rem',
    color: '#94a3b8',
    userSelect: 'none' as const,
  },
  stepInput: {
    width: 44,
    fontSize: '0.73rem',
    padding: '2px 4px',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    textAlign: 'right' as const,
  } as CSSProperties,
};

function CB({
  label,
  title,
  onClick,
  variant = 'default',
}: {
  label: string;
  title?: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger';
}) {
  return (
    <button onClick={onClick} title={title} style={s.btn(variant)}>
      {label}
    </button>
  );
}

// ─── ImageControls ────────────────────────────────────────────────────────────

export function ImageControls({
  getImage,
  log,
}: {
  getImage: () => CropperImageElement | null;
  log: PlaygroundState['log'];
}) {
  const [moveStep, setMoveStep] = useState(10);
  const [zoomStep, setZoomStep] = useState(0.1);
  const [rotateStep, setRotateStep] = useState(45);

  const img = getImage;

  const zoom = (factor: number) => {
    img()?.$zoom(factor);
    log('action', { target: 'image', cmd: '$zoom', scale: factor });
  };
  const rotate = (deg: number) => {
    img()?.$rotate(deg);
    log('action', { target: 'image', cmd: '$rotate', angle: deg });
  };
  const move = (x: number, y: number) => {
    img()?.$move(x, y);
    log('action', { target: 'image', cmd: '$move', x, y });
  };
  const center = () => {
    img()?.$center();
    log('action', { target: 'image', cmd: '$center' });
  };
  const flipH = () => {
    img()?.$scale(-1, 1);
    log('action', { target: 'image', cmd: '$scale', x: -1, y: 1 });
  };
  const flipV = () => {
    img()?.$scale(1, -1);
    log('action', { target: 'image', cmd: '$scale', x: 1, y: -1 });
  };
  const reset = () => {
    img()?.$resetTransform();
    log('action', { target: 'image', cmd: '$resetTransform' });
  };

  return (
    <div style={cs.panel}>
      <div style={cs.header}>
        <span style={s.groupLabel}>Image</span>
      </div>

      {/* Zoom + Rotate + Flip */}
      <div style={cs.row}>
        <span style={cs.stepLabel}>zoom</span>
        <input
          type="number"
          value={zoomStep}
          min={0.01}
          max={2}
          step={0.05}
          onChange={(e) => setZoomStep(parseFloat(e.target.value) || 0.1)}
          style={cs.stepInput}
        />
        <CB label="Zoom +" title="Zoom in" onClick={() => zoom(zoomStep)} />
        <CB label="Zoom −" title="Zoom out" onClick={() => zoom(-zoomStep)} />
      </div>
      <div style={cs.row}>
        <span style={cs.stepLabel}>rotate</span>
        <input
          type="number"
          value={rotateStep}
          min={1}
          max={180}
          step={1}
          onChange={(e) => setRotateStep(parseFloat(e.target.value) || 45)}
          style={cs.stepInput}
        />
        <CB
          label="↻ CW"
          title="Rotate clockwise"
          onClick={() => rotate(rotateStep)}
        />
        <CB
          label="↺ CCW"
          title="Rotate counter-clockwise"
          onClick={() => rotate(-rotateStep)}
        />
        <span style={cs.sep} />
        <CB label="⇔ Flip H" title="Flip horizontal" onClick={flipH} />
        <CB label="⇕ Flip V" title="Flip vertical" onClick={flipV} />
      </div>

      {/* Move + Center + Reset */}
      <div style={cs.row}>
        <span style={cs.stepLabel}>move</span>
        <input
          type="number"
          value={moveStep}
          min={1}
          max={200}
          step={1}
          onChange={(e) => setMoveStep(parseFloat(e.target.value) || 10)}
          style={cs.stepInput}
        />
        <CB label="←" title="Move left" onClick={() => move(-moveStep, 0)} />
        <CB label="→" title="Move right" onClick={() => move(moveStep, 0)} />
        <CB label="↑" title="Move up" onClick={() => move(0, -moveStep)} />
        <CB label="↓" title="Move down" onClick={() => move(0, moveStep)} />
        <span style={cs.sep} />
        <CB label="Center" title="Center the image" onClick={center} />
        <CB
          label="Reset"
          title="Reset all transforms"
          onClick={reset}
          variant="danger"
        />
      </div>
    </div>
  );
}

// ─── SelectionControls ────────────────────────────────────────────────────────

export function SelectionControls({
  getSelection,
  log,
}: {
  getSelection: () => CropperSelectionElement | null;
  log: PlaygroundState['log'];
}) {
  const [moveStep, setMoveStep] = useState(10);
  const [zoomStep, setZoomStep] = useState(0.1);

  const sel = getSelection;

  const zoom = (scale: number) => {
    sel()?.$zoom(scale);
    log('action', { target: 'selection', cmd: '$zoom', scale });
  };
  const move = (x: number, y: number) => {
    sel()?.$move(x, y);
    log('action', { target: 'selection', cmd: '$move', x, y });
  };
  const center = () => {
    sel()?.$center();
    log('action', { target: 'selection', cmd: '$center' });
  };

  return (
    <div style={cs.panel}>
      <div style={cs.header}>
        <span style={s.groupLabel}>Selection</span>
      </div>

      <div style={cs.row}>
        <span style={cs.stepLabel}>zoom</span>
        <input
          type="number"
          value={zoomStep}
          min={0.01}
          max={2}
          step={0.05}
          onChange={(e) => setZoomStep(parseFloat(e.target.value) || 0.1)}
          style={cs.stepInput}
        />
        <CB
          label="Zoom +"
          title="Zoom in selection"
          onClick={() => zoom(zoomStep)}
        />
        <CB
          label="Zoom −"
          title="Zoom out selection"
          onClick={() => zoom(-zoomStep)}
        />
      </div>
      <div style={cs.row}>
        <span style={cs.stepLabel}>move</span>
        <input
          type="number"
          value={moveStep}
          min={1}
          max={200}
          step={1}
          onChange={(e) => setMoveStep(parseFloat(e.target.value) || 10)}
          style={cs.stepInput}
        />
        <CB
          label="←"
          title="Move selection left"
          onClick={() => move(-moveStep, 0)}
        />
        <CB
          label="→"
          title="Move selection right"
          onClick={() => move(moveStep, 0)}
        />
        <CB
          label="↑"
          title="Move selection up"
          onClick={() => move(0, -moveStep)}
        />
        <CB
          label="↓"
          title="Move selection down"
          onClick={() => move(0, moveStep)}
        />
        <span style={cs.sep} />
        <CB label="Center" title="Center the selection" onClick={center} />
      </div>
    </div>
  );
}
