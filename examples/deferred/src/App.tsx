import { useState, useRef, useCallback, type CSSProperties } from 'react';
import { useCropper } from '../../../src';

// ─── Types ────────────────────────────────────────────────────────────────────

type LogEntry = { ts: string; type: string; payload: string };
type Status = 'idle' | 'loading' | 'loaded';

// ─── Constants ────────────────────────────────────────────────────────────────

const IMAGE_URL =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80';

const DELAYS = [500, 1000, 2000, 3000];

// ─── Styles ───────────────────────────────────────────────────────────────────

const c = {
  page: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#f8fafc',
    minHeight: '100vh',
    color: '#1e293b',
    fontSize: 14,
  } as CSSProperties,
  header: {
    background: '#1e293b',
    color: 'white',
    padding: '10px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  } as CSSProperties,
  scenario: {
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: '#92400e',
    lineHeight: 1.5,
  } as CSSProperties,
  code: {
    fontFamily: 'monospace',
    background: '#fef3c7',
    padding: '1px 5px',
    borderRadius: 3,
    fontSize: 12,
  } as CSSProperties,
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  } as CSSProperties,
  body: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  } as CSSProperties,
  cols: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: 14,
    alignItems: 'start',
  } as CSSProperties,
  cropperBox: {
    background: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 320,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as CSSProperties,
  placeholder: {
    color: '#475569',
    fontSize: 13,
    textAlign: 'center',
    padding: 24,
  } as CSSProperties,
  logPanel: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  } as CSSProperties,
  logHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as CSSProperties,
  logLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#94a3b8',
  } as CSSProperties,
  log: {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 6,
    padding: 8,
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#94a3b8',
    minHeight: 280,
    maxHeight: 420,
    overflowY: 'auto',
  } as CSSProperties,
  logEmpty: { color: '#334155', padding: 4 } as CSSProperties,
  logRow: {
    paddingBottom: 4,
    marginBottom: 4,
    borderBottom: '1px solid #1e293b',
  } as CSSProperties,
  logTs: { color: '#475569', marginRight: 6 } as CSSProperties,
  logType: { fontWeight: 700, marginRight: 6 } as CSSProperties,
  logPayload: { color: '#cbd5e1' } as CSSProperties,
  card: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 14,
  } as CSSProperties,
};

function btn(variant: 'default' | 'primary' | 'danger'): CSSProperties {
  return {
    fontSize: 13,
    padding: '5px 12px',
    fontWeight: 500,
    borderRadius: 6,
    cursor: 'pointer',
    border: '1px solid',
    ...(variant === 'primary' && {
      background: '#eff6ff',
      color: '#1d4ed8',
      borderColor: '#93c5fd',
    }),
    ...(variant === 'danger' && {
      background: '#fef2f2',
      color: '#dc2626',
      borderColor: '#fca5a5',
    }),
    ...(variant === 'default' && {
      background: '#f8fafc',
      color: '#334155',
      borderColor: '#e2e8f0',
    }),
  };
}

function statusDot(status: Status): CSSProperties {
  return {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 5,
    background:
      status === 'idle' ? '#94a3b8' : status === 'loading' ? '#f59e0b' : '#22c55e',
  };
}

function statusText(status: Status): CSSProperties {
  return {
    fontSize: 13,
    fontWeight: 600,
    color:
      status === 'idle' ? '#64748b' : status === 'loading' ? '#b45309' : '#16a34a',
  };
}

// ─── Log helpers ──────────────────────────────────────────────────────────────

function ts() {
  const d = new Date();
  return `${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;
}

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [src, setSrc] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [delay, setDelay] = useState(1000);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addEntry = useCallback((type: string, payload: unknown) => {
    setEntries((prev) => {
      const next = [
        { ts: ts(), type, payload: JSON.stringify(payload) },
        ...prev,
      ].slice(0, 50);
      return next;
    });
  }, []);

  // ─── useCropper is called unconditionally at top level ───────────────────
  // renderCropper() output is only mounted once `src` is set.
  // This is the deferred-render scenario from the bug report.
  const { renderCropper, isReady, reset, clear, getBounds } = useCropper({
    src,
    alt: 'Deferred image',
    crossOrigin: 'anonymous',
    onReady: (canvas) => addEntry('ready', { element: canvas.tagName.toLowerCase() }),
    onChange: (e) =>
      addEntry('change', {
        x: r2(e.detail.x),
        y: r2(e.detail.y),
        w: r2(e.detail.width),
        h: r2(e.detail.height),
      }),
    onCropStart: (e) => addEntry('cropstart', { action: e.detail.action }),
    onCropMove: (e) => addEntry('cropmove', { action: e.detail.action }),
    onCropEnd: (e) => addEntry('cropend', { action: e.detail.action }),
    onTransform: (e) =>
      addEntry('transform', { matrix: e.detail.matrix.map(r2) }),
  });

  const load = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSrc('');
    setStatus('loading');
    setEntries([]);
    addEntry('system', { msg: `simulating ${delay}ms async load…` });

    timerRef.current = setTimeout(() => {
      setSrc(IMAGE_URL);
      setStatus('loaded');
      addEntry('system', { msg: 'src resolved — cropper mounting now' });
    }, delay);
  }, [delay, addEntry]);

  const resetAll = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSrc('');
    setStatus('idle');
    setEntries([]);
  }, []);

  return (
    <div style={c.page}>
      <header style={c.header}>
        <strong style={{ fontSize: 15 }}>react-cropper-2</strong>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>
          deferred render example
        </span>
      </header>

      <div style={c.body}>
        <div style={c.scenario}>
          <strong>Scenario:</strong>{' '}
          <span style={c.code}>useCropper()</span> is called unconditionally at
          the top of the component, but{' '}
          <span style={c.code}>renderCropper()</span> is only mounted once an
          async image URL resolves:{' '}
          <span style={c.code}>{'{src && renderCropper()}'}</span>.
          <br />
          Callbacks (<span style={c.code}>onReady</span>,{' '}
          <span style={c.code}>onChange</span>, etc.) should fire normally once
          the cropper mounts. Use the event log on the right to verify.
        </div>

        <div style={c.card}>
          <div style={c.toolbar}>
            <button style={btn('primary')} onClick={load} disabled={status === 'loading'}>
              {status === 'loading' ? `Loading… (${delay}ms)` : 'Load Image'}
            </button>

            <button style={btn('danger')} onClick={resetAll}>
              Reset
            </button>

            <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              Delay:
              <select
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                style={{
                  fontSize: 13,
                  padding: '3px 6px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 4,
                  background: 'white',
                }}
              >
                {DELAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}ms
                  </option>
                ))}
              </select>
            </label>

            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              <span style={statusDot(status)} />
              <span style={statusText(status)}>
                {status === 'idle' && 'Idle — click Load Image'}
                {status === 'loading' && 'Loading…'}
                {status === 'loaded' && `Loaded${isReady ? ' · cropper ready' : ' · initializing…'}`}
              </span>
            </span>
          </div>
        </div>

        <div style={c.cols}>
          <div>
            <div style={c.cropperBox}>
              {/* ← Deferred: only rendered after src resolves */}
              {src ? (
                renderCropper({ style: { height: 400, width: '100%' } })
              ) : (
                <div style={c.placeholder}>
                  {status === 'idle' && '↑ Click "Load Image" to simulate an async image load'}
                  {status === 'loading' && '⏳ Waiting for image URL…'}
                </div>
              )}
            </div>

            {src && (
              <div style={{ ...c.toolbar, marginTop: 10 }}>
                <button style={btn('default')} onClick={() => { reset(); addEntry('action', { cmd: 'reset' }); }}>
                  Reset
                </button>
                <button style={btn('danger')} onClick={() => { clear(); addEntry('action', { cmd: 'clear' }); }}>
                  Clear
                </button>
                <button style={btn('default')} onClick={() => addEntry('action', { cmd: 'getBounds', result: getBounds() })}>
                  Get Bounds
                </button>
              </div>
            )}
          </div>

          <div style={c.logPanel}>
            <div style={c.logHeader}>
              <span style={c.logLabel}>Event Log</span>
              <button style={btn('default')} onClick={() => setEntries([])}>
                Clear
              </button>
            </div>
            <div style={c.log} ref={logRef}>
              {entries.length === 0 ? (
                <div style={c.logEmpty}>No events yet.</div>
              ) : (
                entries.map((e, i) => (
                  <div key={i} style={c.logRow}>
                    <span style={c.logTs}>{e.ts}</span>
                    <span
                      style={{
                        ...c.logType,
                        color:
                          e.type === 'ready'
                            ? '#4ade80'
                            : e.type === 'system'
                              ? '#60a5fa'
                              : e.type === 'action'
                                ? '#f59e0b'
                                : '#e2e8f0',
                      }}
                    >
                      {e.type}
                    </span>
                    <span style={c.logPayload}>{e.payload}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
