import type { CSSProperties, ReactNode } from 'react';

// ─── Styles ───────────────────────────────────────────────────────────────────

export const s = {
  page: {
    fontFamily: 'system-ui,-apple-system,sans-serif',
    background: '#f8fafc',
    minHeight: '100vh',
    color: '#1e293b',
  } as CSSProperties,
  header: {
    background: '#1e293b',
    color: 'white',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  } as CSSProperties,
  tabs: {
    display: 'flex',
    gap: 4,
    padding: '8px 14px',
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
  } as CSSProperties,
  tab: (active: boolean): CSSProperties => ({
    padding: '5px 12px',
    fontSize: '0.83rem',
    fontWeight: active ? 600 : 400,
    color: active ? '#1d4ed8' : '#64748b',
    background: active ? '#eff6ff' : 'transparent',
    border: active ? '1px solid #bfdbfe' : '1px solid transparent',
    borderRadius: 6,
    cursor: 'pointer',
  }),
  shell: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr 300px',
    gap: 14,
    padding: 14,
    alignItems: 'start',
  } as CSSProperties,
  sidebar: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 14,
    position: 'sticky',
    top: 14,
  } as CSSProperties,
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    minWidth: 0,
  } as CSSProperties,
  rightPanel: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 14,
    position: 'sticky',
    top: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    height: '100%',
  } as CSSProperties,
  cropperBox: {
    background: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  } as CSSProperties,
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  } as CSSProperties,
  controls: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  } as CSSProperties,
  bottom: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'fit-content 1fr',
    gap: 10,
  } as CSSProperties,
  logWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  } as CSSProperties,
  logHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as CSSProperties,
  log: {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 6,
    padding: 8,
    fontFamily: 'monospace',
    fontSize: '0.7rem',
    color: '#94a3b8',
    minHeight: 180,
    maxHeight: 100,
    overflowY: 'auto',
  } as CSSProperties,
  logRow: {
    paddingBottom: 3,
    marginBottom: 3,
    borderBottom: '1px solid #1e293b',
  } as CSSProperties,
  logTs: {
    color: '#475569',
    marginRight: 6,
    userSelect: 'none',
  } as CSSProperties,
  logType: { fontWeight: 700, marginRight: 6 } as CSSProperties,
  logPayload: { color: '#cbd5e1' } as CSSProperties,
  previewWrap: {
    display: 'flex',
    gap: 10,
    flexDirection: 'column',
  } as CSSProperties,
  previewImg: {
    width: '100%',
    borderRadius: 4,
    border: '1px solid #e2e8f0',
    display: 'block',
  } as CSSProperties,
  previewEmpty: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
  } as CSSProperties,
  badge: {
    fontSize: '0.68rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#1d4ed8',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 4,
    padding: '2px 6px',
    marginRight: 8,
  } as CSSProperties,
  title: { fontSize: '1rem', fontWeight: 700 } as CSSProperties,
  desc: {
    fontSize: '0.8rem',
    color: '#64748b',
    margin: '3px 0 0',
  } as CSSProperties,
  lbl: {
    fontSize: '0.68rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#94a3b8',
  } as CSSProperties,
  fieldLabel: {
    fontSize: '0.76rem',
    color: '#64748b',
    display: 'block',
    marginBottom: 4,
  } as CSSProperties,
  textInput: {
    width: '100%',
    fontSize: '0.73rem',
    padding: '4px 6px',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    boxSizing: 'border-box',
  } as CSSProperties,
  select: {
    fontSize: '0.78rem',
    padding: '4px 6px',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    background: 'white',
  } as CSSProperties,
  groupLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#94a3b8',
    display: 'block',
    marginBottom: 5,
  } as CSSProperties,
  toggleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3px 6px',
  } as CSSProperties,
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer',
    fontSize: '0.78rem',
    whiteSpace: 'nowrap',
  } as CSSProperties,
  ghostBtn: {
    fontSize: '0.7rem',
    padding: '2px 7px',
    background: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    cursor: 'pointer',
    color: '#64748b',
  } as CSSProperties,
  btn: (v: 'default' | 'primary' | 'danger'): CSSProperties => ({
    fontSize: '0.8rem',
    padding: '5px 11px',
    fontWeight: 500,
    borderRadius: 6,
    cursor: 'pointer',
    border: '1px solid',
    ...(v === 'primary' && {
      background: '#eff6ff',
      color: '#1d4ed8',
      borderColor: '#93c5fd',
    }),
    ...(v === 'danger' && {
      background: '#fef2f2',
      color: '#dc2626',
      borderColor: '#fca5a5',
    }),
    ...(v === 'default' && {
      background: '#f8fafc',
      color: '#334155',
      borderColor: '#e2e8f0',
    }),
  }),
  divider: {
    display: 'inline-block',
    width: 1,
    height: 22,
    background: '#e2e8f0',
    margin: '0 4px',
  } as CSSProperties,
  setBoundsLabel: { fontSize: '0.76rem', color: '#64748b' } as CSSProperties,
  boundsField: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.76rem',
  } as CSSProperties,
  boundsLabel: {
    color: '#94a3b8',
    fontWeight: 600,
    minWidth: 12,
  } as CSSProperties,
  boundsInput: {
    width: 52,
    fontSize: '0.75rem',
    padding: '3px 5px',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    textAlign: 'right',
  } as CSSProperties,
};

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export function Lbl({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return <span style={{ ...s.lbl, ...style }}>{children}</span>;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={s.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label style={s.toggle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor: '#3b82f6' }}
      />
      {label}
    </label>
  );
}

export function ToggleGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <span style={s.groupLabel}>{label}</span>
      <div style={s.toggleGrid}>{children}</div>
    </div>
  );
}

export function Btn({
  label,
  onClick,
  variant = 'default',
}: {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger';
}) {
  return (
    <button onClick={onClick} style={s.btn(variant)}>
      {label}
    </button>
  );
}
