import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Reveal({ g, wordOf, setPlayers, onRepick, onStart }) {
  const [open, setOpen] = useState(null)
  const [name, setName] = useState('')
  const [shown, setShown] = useState(false)
  const [pass, setPass] = useState(false)
  const [err, setErr] = useState('')
  const left = g.players.filter((p) => !p.taken).length
  const p = g.players.find((x) => x.id === open)
  const word = p ? wordOf(p) : null

  const show = () => {
    const t = name.trim()
    if (!t) return setErr('Enter your name first.')
    if (g.players.some((x) => x.taken && x.name.toLowerCase() === t.toLowerCase())) return setErr('That name is already taken.')
    setErr(''); setShown(true)
  }
  const hide = () => {
    setPlayers(g.players.map((x) => (x.id === open ? { ...x, name: name.trim(), taken: true } : x)))
    setOpen(null); setName(''); setShown(false); setPass(left > 1)
  }

  return (
    <div className="mx-auto max-w-3xl p-5 pt-8">
      <h2 className="text-3xl font-extrabold">Pick a card</h2>
      <p className="mb-5 text-[#a99fd6]">{left > 0 ? `${left} card${left > 1 ? 's' : ''} left. Tap one, add your name, read your word in private.` : 'Everyone has a word.'}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {g.players.map((x) => (
          <motion.button key={x.id} disabled={x.taken} whileTap={{ scale: 0.94 }} whileHover={{ y: -4 }}
            onClick={() => setOpen(x.id)}
            className={`flex aspect-[3/4] items-center justify-center rounded-3xl border text-center text-xl font-extrabold ${x.taken ? 'border-line bg-night text-[#a99fd6]' : 'border-amber bg-surf text-5xl text-amber'}`}>
            {x.taken ? <span className="px-2 text-base">✓ {x.name}</span> : '?'}
          </motion.button>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button className="btn flex-1" disabled={left > 0} onClick={onStart}>Start game</button>
        <button className="btn-ghost flex-1" onClick={onRepick}>Repick words</button>
      </div>

      <AnimatePresence>
        {(open !== null || pass) && (
          <motion.div className="fixed inset-0 z-20 flex items-center justify-center bg-black/80 p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="card w-full max-w-sm space-y-4 text-center" initial={{ scale: 0.8, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }}>
              {pass ? (
                <>
                  <p className="text-2xl font-extrabold">Hand it to the next player</p>
                  <button className="btn w-full" onClick={() => setPass(false)}>I'm next</button>
                </>
              ) : !shown ? (
                <>
                  <p className="text-xl font-extrabold">Your name</p>
                  <input autoFocus className="input" value={name} maxLength={16} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && show()} />
                  {err && <p className="text-rose">{err}</p>}
                  <button className="btn w-full" onClick={show}>Show my word</button>
                  <button className="btn-ghost w-full" onClick={() => { setOpen(null); setErr('') }}>Back</button>
                </>
              ) : (
                <>
                  <p className="text-[#a99fd6]">{name.trim()}, your word is</p>
                  {word ? <p className="break-words text-5xl font-extrabold text-mint">{word}</p>
                    : <p className="text-2xl font-extrabold text-rose">You're Mr White. You have no word. Listen closely and blend in.</p>}
                  <button className="btn w-full" onClick={hide}>Hide it</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
