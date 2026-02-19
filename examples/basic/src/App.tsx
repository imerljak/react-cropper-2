import { useState } from 'react';
import { s } from './ui';
import { CropperPlayground } from './CropperPlayground';
import { UseCropperPlayground } from './UseCropperPlayground';
import { AdvancedPlayground } from './AdvancedPlayground';

type Tab = 'component' | 'hook' | 'advanced';

export default function App() {
  const [tab, setTab] = useState<Tab>('component');

  return (
    <div style={s.page}>
      <header style={s.header}>
        <strong style={{ fontSize: '1rem' }}>react-cropper-2</strong>
        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          playground
        </span>
      </header>

      <nav style={s.tabs}>
        {(['component', 'hook', 'advanced'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={s.tab(tab === t)}>
            {t === 'component'
              ? '<Cropper>'
              : t === 'hook'
                ? 'useCropper'
                : 'useCropperAdvanced'}
          </button>
        ))}
      </nav>

      {tab === 'component' && <CropperPlayground />}
      {tab === 'hook' && <UseCropperPlayground />}
      {tab === 'advanced' && <AdvancedPlayground />}
    </div>
  );
}
