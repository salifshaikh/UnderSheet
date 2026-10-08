import { useState } from 'react'

function Step({ label, val, min, max, on, hint }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div><p className="font-semibold">{label}</p>{hint && <p className="text-sm text-[#a99fd6]">{hint}</p>}</div>
      <div className="flex items-center gap-3">
        <button className="btn-ghost !px-4 !py-2" onClick={() => on(Math.max(min, val - 1))} aria-label={`less ${label}`}>−</button>
        <span className="w-8 text-center text-2xl font-extrabold">{val}</span>
        <button className="btn-ghost !px-4 !py-2" onClick={() => on(Math.min(max, val + 1))} aria-label={`more ${label}`}>+</button>
      </div>
    </div>
  )
}

export default function Setup({ cfg, groups, gid: g0, onStart, onDelete, onClear }) {
  const first = groups.find((x) => x.id === g0)
  const [gid, setGid] = useState(first ? g0 : null)
  const [names, setNames] = useState(first ? first.names : [])
  const [c, setC] = useState(first ? first.cfg : cfg)
  const [nn, setNn] = useState('')
  const [e, setE] = useState('')
  const grp = groups.find((x) => x.id === gid)

  const load = (q) => { setGid(q.id); setNames(q.names); setC({ ...q.cfg }); setE('') }
  const leave = () => { setGid(null); setNames([]); setC({ n: 6, i: 1, w: 0 }) }
  const add = () => {
    const t = nn.trim()
    if (!t) return
    if (names.some((x) => x.toLowerCase() === t.toLowerCase())) return setE('That name is already in the group.')
    if (names.length >= 20) return setE('Max 20 players.')
    setNames([...names, t]); setNn(''); setE('')
  }
  const n = gid ? names.length : c.n
  const civ = n - c.i - c.w
  const err = civ < 3 ? 'Need at least 3 civilians.' : c.i + c.w < 1 ? 'Add at least one imposter or Mr White.' : ''

  return (
    <div className="mx-auto max-w-md space-y-5 p-5 pt-10">
      <div className="flex items-center gap-4">
        <img src="/favicon.png" alt="Word Sleuth Logo" className="h-12 w-12 rounded-xl shadow-lg" />
        <h1 className="text-5xl font-extrabold tracking-tight">Word Sleuth</h1>
      </div>
      <p className="text-[#a99fd6]">Everyone gets a word. One of you got a different one and doesn't know it.</p>

      {groups.length > 0 && (
        <div className="card space-y-2">
          <p className="font-semibold">Saved groups</p>
          {groups.map((q) => (
            <div key={q.id} className="flex gap-2">
              <button onClick={() => load(q)} className={`flex-1 rounded-2xl border px-4 py-3 text-left font-semibold ${gid === q.id ? 'border-amber text-amber' : 'border-line'}`}>
                {q.name} <span className="text-sm font-normal text-[#a99fd6]">· {q.names.length} players</span>
              </button>
              <button className="btn-ghost !px-3" aria-label={`delete ${q.name}`} onClick={() => { if (confirm(`Delete "${q.name}"?`)) { onDelete(q.id); if (gid === q.id) leave() } }}>✕</button>
            </div>
          ))}
          {gid && <button className="btn-ghost w-full" onClick={leave}>Start without a group</button>}
        </div>
      )}

      <div className="card divide-y divide-line">
        {gid ? (
          <div className="space-y-3 pb-4">
            <p className="font-semibold">{grp?.name}: players</p>
            <div className="flex flex-wrap gap-2">
              {names.map((x) => (
                <span key={x} className="flex items-center gap-2 rounded-full border border-mint px-3 py-1 text-mint">
                  {x}<button aria-label={`remove ${x}`} onClick={() => setNames(names.filter((y) => y !== x))}>✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input" placeholder="Add a player" value={nn} maxLength={16} onChange={(ev) => setNn(ev.target.value)} onKeyDown={(ev) => ev.key === 'Enter' && add()} />
              <button className="btn !px-4" onClick={add}>Add</button>
            </div>
            {e && <p className="text-rose">{e}</p>}
          </div>
        ) : (
          <Step label="Players" val={c.n} min={4} max={20} on={(v) => setC({ ...c, n: v })} />
        )}
        <Step label="Imposters" hint="Get a similar word" val={c.i} min={0} max={6} on={(i) => setC({ ...c, i })} />
        <Step label="Mr White" hint="Gets no word" val={c.w} min={0} max={4} on={(w) => setC({ ...c, w })} />
        <div className="flex justify-between py-3"><span className="font-semibold">Civilians</span><span className="text-2xl font-extrabold text-mint">{Math.max(civ, 0)}</span></div>
      </div>
      {err && <p className="text-rose">{err}</p>}
      <button className="btn w-full text-lg" disabled={!!err} onClick={() => onStart({ n, i: c.i, w: c.w }, gid ? names : null, gid)}>
        {gid ? 'Deal the cards' : 'Deal the cards (names next)'}
      </button>
      {gid && <button className="btn-ghost w-full" onClick={() => { if (confirm('Reset all scores in this group?')) onClear(gid) }}>Reset group scores</button>}
    </div>
  )
}