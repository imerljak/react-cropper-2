import type { ReactNode } from 'react';
import { ASPECT_RATIOS, EVENT_COLOR, type PlaygroundState } from './playground';
import { s, Lbl, Field, Toggle, ToggleGroup } from './ui';

export function PlaygroundShell({
  state,
  title,
  badge,
  description,
  actions,
  controls,
  children,
  showGrid = false,
}: {
  state: PlaygroundState;
  title: string;
  badge: string;
  description: string;
  actions: ReactNode;
  controls?: ReactNode;
  children: ReactNode;
  showGrid?: boolean;
}) {
  const { knobs, setKnob, events, clearEvents } = state;

  return (
    <div style={s.shell}>
      {/* ── Left Sidebar ── */}
      <aside style={s.sidebar}>
        <Lbl>Knobs</Lbl>

        <Field label="Source URL">
          <input
            type="text"
            value={knobs.src}
            onChange={(e) => setKnob({ src: e.target.value })}
            style={s.textInput}
          />
        </Field>

        <Field label="Aspect Ratio">
          <select
            value={knobs.aspectRatio}
            onChange={(e) => setKnob({ aspectRatio: e.target.value })}
            style={s.select}
          >
            {Object.keys(ASPECT_RATIOS).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>

        <Field label={`Coverage: ${knobs.initialCoverage}`}>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={knobs.initialCoverage}
            onChange={(e) =>
              setKnob({ initialCoverage: parseFloat(e.target.value) })
            }
            style={{ width: '100%' }}
          />
        </Field>

        <ToggleGroup label="Canvas">
          <Toggle
            label="background"
            checked={knobs.background}
            onChange={(v) => setKnob({ background: v })}
          />
        </ToggleGroup>

        <ToggleGroup label="Image">
          <Toggle
            label="rotatable"
            checked={knobs.rotatable}
            onChange={(v) => setKnob({ rotatable: v })}
          />
          <Toggle
            label="scalable"
            checked={knobs.scalable}
            onChange={(v) => setKnob({ scalable: v })}
          />
          <Toggle
            label="skewable"
            checked={knobs.skewable}
            onChange={(v) => setKnob({ skewable: v })}
          />
          <Toggle
            label="translatable"
            checked={knobs.translatable}
            onChange={(v) => setKnob({ translatable: v })}
          />
        </ToggleGroup>

        <ToggleGroup label="Selection">
          <Toggle
            label="movable"
            checked={knobs.movable}
            onChange={(v) => setKnob({ movable: v })}
          />
          <Toggle
            label="resizable"
            checked={knobs.resizable}
            onChange={(v) => setKnob({ resizable: v })}
          />
          <Toggle
            label="zoomable"
            checked={knobs.zoomable}
            onChange={(v) => setKnob({ zoomable: v })}
          />
          <Toggle
            label="multiple"
            checked={knobs.multiple}
            onChange={(v) => setKnob({ multiple: v })}
          />
          <Toggle
            label="outlined"
            checked={knobs.outlined}
            onChange={(v) => setKnob({ outlined: v })}
          />
        </ToggleGroup>

        {showGrid && (
          <ToggleGroup label="Display">
            <Toggle
              label="grid"
              checked={knobs.grid}
              onChange={(v) => setKnob({ grid: v })}
            />
          </ToggleGroup>
        )}
      </aside>

      {/* ── Main ── */}
      <div style={s.main}>
        <div style={{ marginBottom: 12 }}>
          <span style={s.badge}>{badge}</span>
          <span style={s.title}>{title}</span>
          <p style={s.desc}>{description}</p>
        </div>

        <div style={s.cropperBox}>{children}</div>

        <div style={s.actions}>{actions}</div>

        <div style={s.bottom}>
          {controls && <div style={s.controls}>{controls}</div>}

          {/* Event log */}
          <div style={s.logWrap}>
            <div style={s.logHeader}>
              <Lbl>Event Log</Lbl>
              <button onClick={clearEvents} style={s.ghostBtn}>
                Clear
              </button>
            </div>
            <div style={s.log}>
              {events.length === 0 ? (
                <span style={{ color: '#475569' }}>
                  No events yet — interact with the cropper.
                </span>
              ) : (
                [...events].reverse().map((e) => (
                  <div key={e.id} style={s.logRow}>
                    <span style={s.logTs}>{e.ts}</span>
                    <span
                      style={{
                        ...s.logType,
                        color: EVENT_COLOR[e.type] ?? '#94a3b8',
                      }}
                    >
                      {e.type}
                    </span>
                    <span style={s.logPayload}>
                      {JSON.stringify(e.payload)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <aside style={s.rightPanel}>
        {/* Live Preview */}
        <Lbl style={{ marginBottom: 6 }}>Live Preview</Lbl>
        <div style={s.previewWrap}>
          <cropper-viewer
            selection="cropper-selection"
            resize="vertical"
            style={{
              maxWidth: '100%',
              width: '320px',
              display: 'block',
            }}
          />
          <cropper-viewer
            selection="cropper-selection"
            resize="vertical"
            style={{ maxWidth: '100%', width: '160px', display: 'block' }}
          />
          <cropper-viewer
            selection="cropper-selection"
            resize="vertical"
            style={{
              maxWidth: '100%',
              width: '80px',
              height: 'auto',
              display: 'block',
            }}
          />
          <cropper-viewer
            selection="cropper-selection"
            resize="vertical"
            style={{ maxWidth: '100%', width: '40px', display: 'block' }}
          />
        </div>
      </aside>
    </div>
  );
}
