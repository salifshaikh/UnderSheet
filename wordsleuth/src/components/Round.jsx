import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Wheel from './Wheel'

export const ROLE = { c: 'Civilian', i: 'Imposter', w: 'Mr White' }
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

export default function Round({ g, onSpoke, onVote, onContinue }) {
  const [voting, setVoting] = useState(false)
  const [pick, setPick] = useState(null)
  const [guesses, setGuesses] = useState({})
  const [res, setRes] = useState(null)
  const alive = g.players.filter((p) => p.alive)
  const civAlive = alive.filter((p) => p.role === 'c').length
  const remaining = alive.filter((p) => !g.order.includes(p.id))
  const name = (id) => g.players.find((p) => p.id === id).name
  const out = g.out != null ? g.players.find((p) => p.id === g.out) : null

  const mws = g.players.filter((p) => p.role === 'w' && (p.alive || p.id === g.out))
  const submit = () => setRes({ ids: mws.filter((p) => norm(guesses[p.id] || '') !== '' && norm(guesses[p.id]) === norm(g.civ)).map((p) => p.id) })
  const done = (ids) => { setRes(null); setGuesses({}); onContinue(ids) }

  return (
    <div className="mx-auto max-w-md space-y-5 p-5 pt-8">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-extrabold">Round {g.round}</h2>
        <p className="text-[#a99fd6]">{alive.length} alive · {civAlive} civilians</p>
      </div>
      {civAlive === 3 && <p className="rounded-2xl border border-rose p-3 text-rose">Final vote: if a civilian goes out, the game ends.</p>}

      <div className="card">
        {remaining.length > 0 ? (
          <>
            <p className="mb-4 text-center font-semibold">Spin to pick who describes their word next</p>
            <Wheel key={remaining.map((r) => r.id).join('-')} items={remaining} onPick={onSpoke} />
          </>
        ) : <p className="text-center text-xl font-extrabold text-mint">Everyone has spoken. Discuss, then vote.</p>}
      </div>

      {g.order.length > 0 && (
        <ol className="card space-y-2">
          {g.order.map((id, k) => (
            <motion.li key={id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex gap-3 text-lg">
              <span className="w-6 font-extrabold text-amber">{k + 1}</span>{name(id)}
            </motion.li>
          ))}
        </ol>
      )}
      <div className="flex flex-wrap gap-2">
        {g.players.map((p) => <span key={p.id} className={`rounded-full border px-3 py-1 text-sm ${p.alive ? 'border-mint text-mint' : 'border-line text-[#6f66a0] line-through'}`}>{p.name}</span>)}
      </div>
      <button className="btn w-full text-lg" onClick={() => { setVoting(true); setPick(null) }}>Vote someone out</button>

      <AnimatePresence>
        {(voting || out) && (
          <motion.div className="fixed inset-0 z-20 flex items-center justify-center bg-black/80 p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="card max-h-[90vh] w-full max-w-sm space-y-4 overflow-y-auto text-center" initial={{ scale: 0.85 }} animate={{ scale: 1 }}>
              {out ? (
                <>
                  <p className="text-[#a99fd6]">{out.name} was voted out</p>
                  <motion.p initial={{ rotateX: 90 }} animate={{ rotateX: 0 }} className={`text-4xl font-extrabold ${out.role === 'c' ? 'text-mint' : 'text-rose'}`}>
                    {out.role === 'c' ? 'A civilian' : out.role === 'i' ? 'The imposter!' : 'Mr White!'}
                  </motion.p>
                  {out.role === 'w' && !res && (
                    <>
                      <p>Each Mr White writes their own guess for the civilian word.</p>
                      {mws.map((p) => (
                        <div key={p.id} className="text-left">
                          <p className="text-sm text-[#a99fd6]">{p.name}</p>
                          <input className="input" placeholder="Guess" value={guesses[p.id] || ''} onChange={(e) => setGuesses({ ...guesses, [p.id]: e.target.value })} />
                        </div>
                      ))}
                      <button className="btn w-full" onClick={submit}>Submit guesses</button>
                    </>
                  )}
                  {res && res.ids.length > 0 && <><p className="text-xl font-extrabold text-mint">{res.ids.map(name).join(', ')} guessed it! The word was {g.civ}.</p><button className="btn w-full" onClick={() => done(res.ids)}>See scores</button></>}
                  {res && res.ids.length === 0 && <><p className="text-xl font-extrabold text-rose">No correct guess.</p><button className="btn w-full" onClick={() => done([])}>Continue</button></>}
                  {out.role !== 'w' && <button className="btn w-full" onClick={() => done([])}>Continue</button>}
                </>
              ) : (
                <>
                  <p className="text-xl font-extrabold">Who goes out?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {alive.map((p) => <button key={p.id} onClick={() => setPick(p.id)} className={`rounded-2xl border px-3 py-3 font-semibold ${pick === p.id ? 'border-amber bg-amber text-night' : 'border-line'}`}>{p.name}</button>)}
                  </div>
                  <button className="btn w-full" disabled={pick === null} onClick={() => { onVote(pick); setVoting(false) }}>Confirm vote</button>
                  <button className="btn-ghost w-full" onClick={() => setVoting(false)}>Cancel</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}