import { useEffect, useState } from 'react'
import { WORDS } from './words'
import Setup from './components/Setup'
import Reveal from './components/Reveal'
import Round from './components/Round'
import Over from './components/Over'
import Footer from './components/Footer'

const KEY = 'wordsleuth_v2'
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const fresh = { phase: 'setup', cfg: { n: 6, i: 1, w: 0 }, history: [], totals: {}, game: null, groups: [], gid: null }

function load() { try { return { ...fresh, ...(JSON.parse(localStorage.getItem(KEY)) || {}) } } catch { return fresh } }

function make(cfg, history, names) {
  const n = names ? names.length : cfg.n
  const recent = history.slice(-20)
  let pool = WORDS.filter((p) => !recent.includes(p.join('|')))
  if (!pool.length) pool = WORDS.filter((p) => p.join('|') !== history[history.length - 1])
  const pair = pool[Math.floor(Math.random() * pool.length)]
  const [civ, imp] = Math.random() < 0.5 ? pair : [pair[1], pair[0]]
  const roles = shuffle([...Array(n - cfg.i - cfg.w).fill('c'), ...Array(cfg.i).fill('i'), ...Array(cfg.w).fill('w')])
  return { key: pair.join('|'), civ, imp, round: 1, order: [], out: null, result: null,
    players: roles.map((role, id) => ({ id, role, name: names ? names[id] : '', pre: !!names, alive: true, taken: false })) }
}

function check(g) {
  const al = g.players.filter((p) => p.alive) // only ALIVE players can ever score
  const cnt = (r) => al.filter((p) => p.role === r)
  const C = g.players.filter((p) => p.role === 'c').length
  const pts = (list, v) => Object.fromEntries(list.map((p) => [p.id, v]))
  if (!cnt('i').length && !cnt('w').length) return { winner: 'Civilians', points: pts(cnt('c'), 2) }
  if (cnt('c').length <= 2) {
    const i = cnt('i'), w = cnt('w')
    const winner = i.length && w.length ? 'Imposters & Mr White' : i.length ? 'Imposters' : 'Mr White'
    return { winner, points: pts([...i, ...w], C) } // alive imposters AND alive Mr Whites
  }
  return null
}

export default function App() {
  const [s, setS] = useState(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {} }, [s])
  const upd = (f) => setS((x) => ({ ...x, game: f(x.game) }))

  // names: array = known roster (no name entry), null = ask names at the card reveal
  const start = (cfg, names = null, gid = undefined, keep = false) => setS((x) => {
    const game = make(cfg, x.history, names)
    const id = gid === undefined ? x.gid : gid
    const grp = x.groups.find((q) => q.id === id)
    const c = { n: game.players.length, i: cfg.i, w: cfg.w }
    return { ...x, cfg: c, gid: id, phase: 'reveal', game,
      totals: keep ? x.totals : grp ? grp.totals : {},
      groups: grp ? x.groups.map((q) => (q.id === id ? { ...q, names: names || q.names, cfg: c } : q)) : x.groups,
      history: [...x.history, game.key].slice(-20) }
  })
  const again = () => start(s.cfg, s.game.players.map((p) => p.name), undefined, true)
  const repick = () => start(s.cfg, s.game.players[0]?.pre ? s.game.players.map((p) => p.name) : null, undefined, true)

  const finish = (g, result) => setS((x) => {
    const totals = { ...x.totals }
    g.players.forEach((p) => { totals[p.name] = (totals[p.name] || 0) + (result.points[p.id] || 0) })
    const names = g.players.map((p) => p.name)
    return { ...x, phase: 'over', game: { ...g, out: null, result }, totals,
      groups: x.groups.map((q) => (q.id === x.gid ? { ...q, totals, names, cfg: x.cfg } : q)) }
  })
  const cont = (ok) => {
    const g = s.game
    if (ok) { // all Mr Whites guessed the word together
      const C = g.players.filter((p) => p.role === 'c').length
      return finish(g, { winner: 'Mr White', points: Object.fromEntries(g.players.filter((p) => p.role === 'w').map((p) => [p.id, C])) })
    }
    const r = check(g)
    if (r) finish(g, r)
    else upd((g) => ({ ...g, out: null, order: [], round: g.round + 1 }))
  }
  const saveGroup = (name) => setS((x) => {
    const id = String(Date.now())
    const names = x.game.players.map((p) => p.name)
    return { ...x, gid: id, groups: [...x.groups, { id, name, names, cfg: x.cfg, totals: x.totals }] }
  })
  const delGroup = (id) => setS((x) => ({ ...x, gid: x.gid === id ? null : x.gid, groups: x.groups.filter((q) => q.id !== id) }))
  const clearScores = (id) => setS((x) => ({ ...x, totals: {}, groups: x.groups.map((q) => (q.id === id ? { ...q, totals: {} } : q)) }))

  const g = s.game
  const wordOf = (p) => (p.role === 'c' ? g.civ : p.role === 'i' ? g.imp : null)
  const grp = s.groups.find((q) => q.id === s.gid)

  return (
    <div className="flex min-h-screen flex-col">
    <main className="flex-1">
      {s.phase === 'setup' && <Setup cfg={s.cfg} groups={s.groups} gid={s.gid} onStart={start} onDelete={delGroup} onClear={clearScores} />}
      {s.phase === 'reveal' && g && (
        <Reveal g={g} wordOf={wordOf} setPlayers={(players) => upd((g) => ({ ...g, players }))}
          onRepick={repick} onStart={() => setS((x) => ({ ...x, phase: 'play' }))} />
      )}
      {s.phase === 'play' && g && (
        <Round g={g} onSpoke={(id) => upd((g) => ({ ...g, order: [...g.order, id] }))}
          onVote={(id) => upd((g) => ({ ...g, out: id, players: g.players.map((p) => (p.id === id ? { ...p, alive: false } : p)) }))}
          onContinue={cont} />
      )}
      {s.phase === 'over' && g && <Over g={g} totals={s.totals} group={grp} onSave={saveGroup} onAgain={again} onSetup={() => setS((x) => ({ ...x, phase: 'setup' }))} />}
    </main>
    <Footer />
    </div>
  )
}