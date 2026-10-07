import { useState } from 'react'
import { motion } from 'framer-motion'
import { ROLE } from './Round'

export default function Over({ g, totals, group, onSave, onAgain, onSetup }) {
  const [gn, setGn] = useState('')
  const rows = g.players
    .map((p) => ({ ...p, pts: g.result.points[p.id] || 0, total: totals[p.name] || 0 }))
    .sort((a, b) => b.total - a.total || b.pts - a.pts)
  return (
    <div className="mx-auto max-w-lg space-y-5 p-5 pt-8">
      <motion.h2 initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-extrabold text-amber">
        {g.result.winner} win{g.result.winner === 'Mr White' ? 's' : ''}!
      </motion.h2>
      <p className="text-[#a99fd6]">Civilians had “{g.civ}”. {g.imp ? <>Imposters had “{g.imp}”.</> : null}</p>
      <div className="card space-y-1">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 pb-2 text-sm text-[#a99fd6]"><span>Player</span><span>This game</span><span>Total</span></div>
        {rows.map((r, k) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.07 }}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-t border-line py-2">
            <div><p className="font-extrabold">{k + 1}. {r.name}</p>
              <p className={`text-sm ${r.role === 'c' ? 'text-mint' : 'text-rose'}`}>{ROLE[r.role]}{r.alive ? '' : ' · out'}</p></div>
            <span className="w-10 text-right font-semibold">+{r.pts}</span>
            <span className="w-10 text-right text-xl font-extrabold text-amber">{r.total}</span>
          </motion.div>
        ))}
      </div>
      <div className="card space-y-3">
        {group ? <p>Scores saved to <b className="text-mint">{group.name}</b>.</p> : (
          <>
            <p className="font-semibold">Save these players as a group</p>
            <div className="flex gap-2">
              <input className="input" placeholder="e.g. Cousins, Office" value={gn} maxLength={24} onChange={(e) => setGn(e.target.value)} />
              <button className="btn !px-4" disabled={!gn.trim()} onClick={() => onSave(gn.trim())}>Save</button>
            </div>
          </>
        )}
      </div>
      <button className="btn w-full text-lg" onClick={onAgain}>Play again (same players)</button>
      <button className="btn-ghost w-full" onClick={onSetup}>Groups and setup</button>
    </div>
  )
}