import React, { memo, useRef, useState } from 'react';

const initialItems = [
  { id: 'a1', name: 'Aarav', role: 'Designer' },
  { id: 'b2', name: 'Bhavya', role: 'Developer' },
  { id: 'c3', name: 'Charan', role: 'Tester' },
  { id: 'd4', name: 'Diya', role: 'Analyst' }
];

// Each row owns its draft value. Reconciliation decides which row keeps that state.
const UserRow = memo(function UserRow({ item }) {
  const [draft, setDraft] = useState(item.name);
  const renders = useRef(0);
  renders.current += 1;
  const mismatched = draft !== item.name;

  return (
    <div className={`user-row ${mismatched ? 'mismatch' : ''}`}>
      <div className="avatar">{item.name.charAt(0)}</div>
      <div className="user-info">
        <strong>{item.name}</strong>
        <small>{item.role} · ID {item.id}</small>
        <input aria-label={`Draft for ${item.name}`} value={draft}
          onChange={(event) => setDraft(event.target.value)} />
        {mismatched && <small className="warning">Draft differs from this item's name</small>}
      </div>
      <span className="render-count">Renders: {renders.current}</span>
    </div>
  );
});

function ListPanel({ title, subtitle, items, keyMode }) {
  return (
    <section className="panel">
      <div className="panel-head"><h2>{title}</h2><p>{subtitle}</p></div>
      <div className="rows">
        {keyMode === 'stable'
          ? items.map((item) => <UserRow key={item.id} item={item} />)
          : keyMode === 'index'
            ? items.map((item, index) => <UserRow key={index} item={item} />)
            : items.map((item) => <UserRow item={item} />)}
      </div>
      <p className="panel-tip">{keyMode === 'stable'
        ? 'State stays with the same user ID after reordering.'
        : keyMode === 'index'
          ? 'State follows the row position, not the user.'
          : 'Without keys, React falls back to positions and warns in Console.'}</p>
    </section>
  );
}

function shuffleArray(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  // Ensure the button causes a different order, even in the rare unchanged shuffle.
  if (result.every((item, i) => item.id === items[i].id) && result.length > 1) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
}

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [showMissing, setShowMissing] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [action, setAction] = useState('Initial order');

  function changeOrder(type) {
    if (type === 'shuffle') {
      setItems((current) => shuffleArray(current));
      setAction('Shuffled users');
    } else {
      setItems((current) => [...current].reverse());
      setAction('Reversed users');
    }
  }

  function restore() {
    setItems(initialItems);
    setGeneration((n) => n + 1); // remount rows and reset their local drafts
    setAction('Reset to original order and draft values');
  }

  return (
    <div className="app-shell">
      <header className="topbar"><div className="brand-mark">R</div><div><strong>React Lab</strong><span>Day 38 · Reconciliation</span></div></header>
      <main>
        <div className="hero">
          <div><span className="eyebrow">REACT KEY EXPERIMENT</span><h1>See how React preserves state</h1>
          <p>Edit any draft field, then shuffle or reverse the users. Compare stable keys with index or missing keys.</p></div>
          <div className="hero-stat"><b>{items.length}</b><span>Users in each list</span></div>
        </div>
        <div className="toolbar">
          <button className="primary" onClick={() => changeOrder('shuffle')}>⇄ Shuffle</button>
          <button onClick={() => changeOrder('reverse')}>↕ Reverse order</button>
          <button onClick={restore}>↺ Reset demo</button>
          <label className="checkbox"><input type="checkbox" checked={showMissing} onChange={(e) => setShowMissing(e.target.checked)} /> Show missing keys</label>
        </div>
        <p className="activity">Last action: <strong>{action}</strong></p>
        <div className="comparison" key={generation}>
          <ListPanel title="Stable keys" subtitle="key={item.id}" items={items} keyMode="stable" />
          <ListPanel title="Index keys" subtitle="key={index}" items={items} keyMode="index" />
          {showMissing && <ListPanel title="Missing keys" subtitle="No key prop (Console warning)" items={items} keyMode="missing" />}
        </div>
        <section className="instructions">
          <h2>How to verify</h2>
          <ol><li>Change a draft name in each list (for example, type <b>Edited</b>).</li>
          <li>Click <b>Shuffle</b> or <b>Reverse order</b>. The stable-key draft follows its user; index-key drafts may move to another user.</li>
          <li>Turn on <b>Show missing keys</b> and inspect Chrome Console for React's key warning.</li>
          <li>Watch each row's <b>Renders</b> counter. Open React DevTools → Profiler, record while shuffling, and compare committed updates. Counts can vary in development.</li></ol>
          <p><b>Note:</b> Index/missing keys cause state-preservation issues when order changes; render counts by themselves are not a universal performance benchmark.</p>
        </section>
      </main><footer>React reconciliation demo · Day 38</footer>
    </div>
  );
}