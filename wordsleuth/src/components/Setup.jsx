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

export default function Setup({ cfg, onStart, totals, onResetScores }) {
  const [c, setC] = useState(cfg)
  const civ = c.n - c.i - c.w
  const err = civ < 3 ? 'Need at least 3 civilians.' : c.i + c.w < 1 ? 'Add at least one imposter or Mr White.' : ''
  const has = Object.keys(totals).length > 0
  return (
    <div className="mx-auto max-w-md space-y-5 p-5 pt-10">
      <h1 className="text-5xl font-extrabold tracking-tight">Word Sleuth</h1>
      <p className="text-[#a99fd6]">Everyone gets a word. One of you got a different one and doesn't know it.</p>
      <div className="card divide-y divide-line">
        <Step label="Players" val={c.n} min={4} max={20} on={(n) => setC({ ...c, n })} />
        <Step label="Imposters" hint="Get a similar word" val={c.i} min={0} max={6} on={(i) => setC({ ...c, i })} />
        <Step label="Mr White" hint="Gets no word" val={c.w} min={0} max={4} on={(w) => setC({ ...c, w })} />
        <div className="flex justify-between py-3"><span className="font-semibold">Civilians</span><span className="text-2xl font-extrabold text-mint">{Math.max(civ, 0)}</span></div>
      </div>
      {err && <p className="text-rose">{err}</p>}
      <button className="btn w-full text-lg" disabled={!!err} onClick={() => onStart(c)}>Deal the cards</button>
      {has && <button className="btn-ghost w-full" onClick={onResetScores}>Clear saved scores</button>}
    </div>
  )
}
