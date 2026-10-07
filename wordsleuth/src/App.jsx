import { useEffect, useState } from 'react'
import { WORDS } from './words'
import Setup from './components/Setup'
import Reveal from './components/Reveal'
import Round from './components/Round'
import Over from './components/Over'

const KEY = 'wordsleuth_v1'
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const fresh = { phase: 'setup', cfg: { n: 6, i: 1, w: 0 }, history: [], totals: {}, game: null }

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || fresh } catch { return fresh } }

function make(cfg, history) {
  const recent = history.slice(-20)
  let pool = WORDS.filter((p) => !recent.includes(p.join('|')))
  if (!pool.length) pool = WORDS.filter((p) => p.join('|') !== history[history.length - 1])
  const pair = pool[Math.floor(Math.random() * pool.length)]
  const [civ, imp] = Math.random() < 0.5 ? pair : [pair[1], pair[0]]
  const roles = shuffle([...Array(cfg.n - cfg.i - cfg.w).fill('c'), ...Array(cfg.i).fill('i'), ...Array(cfg.w).fill('w')])
  return { key: pair.join('|'), civ, imp, round: 1, order: [], out: null, result: null,
    players: roles.map((role, id) => ({ id, role, name: '', alive: true, taken: false })) }
}

function check(g) {
  const al = g.players.filter((p) => p.alive)
  const cnt = (r) => al.filter((p) => p.role === r)
  const C = g.players.filter((p) => p.role === 'c').length
  const pts = (list, v) => Object.fromEntries(list.map((p) => [p.id, v]))
  if (!cnt('i').length && !cnt('w').length) return { winner: 'Civilians', points: pts(cnt('c'), 2) }
  if (cnt('c').length <= 2) {
    return cnt('i').length ? { winner: 'Imposters', points: pts(cnt('i'), C) } : { winner: 'Mr White', points: pts(cnt('w'), C) }
  }
  return null
}

export default function App() {
  const [s, setS] = useState(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {} }, [s])

  const upd = (f) => setS((x) => ({ ...x, game: f(x.game) }))
  const start = (cfg) => setS((x) => {
    const game = make(cfg, x.history)
    return { ...x, cfg, phase: 'reveal', game, history: [...x.history, game.key].slice(-20) }
  })
  const finish = (g, result) => setS((x) => {
    const totals = { ...x.totals }
    g.players.forEach((p) => { totals[p.name] = (totals[p.name] || 0) + (result.points[p.id] || 0) })
    return { ...x, phase: 'over', game: { ...g, out: null, result }, totals }
  })
  const cont = (ok) => {
    const g = s.game
    if (ok) {
      const C = g.players.filter((p) => p.role === 'c').length
      return finish(g, { winner: 'Mr White', points: Object.fromEntries(g.players.filter((p) => p.role === 'w').map((p) => [p.id, C])) })
    }
    const r = check(g)
    if (r) finish(g, r)
    else upd((g) => ({ ...g, out: null, order: [], round: g.round + 1 }))
  }
  const g = s.game
  const wordOf = (p) => (p.role === 'c' ? g.civ : p.role === 'i' ? g.imp : null)

  return (
    <main className="min-h-screen">
      {s.phase === 'setup' && <Setup cfg={s.cfg} totals={s.totals} onStart={start} onResetScores={() => setS((x) => ({ ...x, totals: {} }))} />}
      {s.phase === 'reveal' && g && (
        <Reveal g={g} wordOf={wordOf} setPlayers={(players) => upd((g) => ({ ...g, players }))}
          onRepick={() => start(s.cfg)} onStart={() => setS((x) => ({ ...x, phase: 'play' }))} />
      )}
      {s.phase === 'play' && g && (
        <Round g={g} onSpoke={(id) => upd((g) => ({ ...g, order: [...g.order, id] }))}
          onVote={(id) => upd((g) => ({ ...g, out: id, players: g.players.map((p) => (p.id === id ? { ...p, alive: false } : p)) }))}
          onContinue={cont} />
      )}
      {s.phase === 'over' && g && <Over g={g} totals={s.totals} onAgain={() => start(s.cfg)} onSetup={() => setS((x) => ({ ...x, phase: 'setup' }))} />}
    </main>
  )
}
