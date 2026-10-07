import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#7c5cff', '#46e0b4', '#ff6b8b', '#ffc43d', '#4aa8ff', '#ff9d4a']

export default function Wheel({ items, onPick }) {
  const [rot, setRot] = useState(0)
  const [busy, setBusy] = useState(false)
  const target = useRef(null)
  const size = Math.min(typeof window !== 'undefined' ? window.innerWidth - 56 : 320, 340)
  const n = items.length
  const seg = 360 / n

  const spin = () => {
    if (busy || n === 0) return
    const k = Math.floor(Math.random() * n)
    target.current = items[k].id
    const center = k * seg + seg / 2 + (Math.random() - 0.5) * seg * 0.6
    const delta = (((-(rot + center)) % 360) + 360) % 360
    setBusy(true)
    setRot(rot + 360 * 6 + delta)
  }
  const bg = `conic-gradient(${items.map((_, k) => `${COLORS[k % COLORS.length]} ${k * seg}deg ${(k + 1) * seg}deg`).join(',')})`

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute left-1/2 top-[-10px] z-10 h-0 w-0 -translate-x-1/2 border-x-[12px] border-t-[22px] border-x-transparent border-t-white" />
        <motion.div className="relative h-full w-full rounded-full border-4 border-white shadow-2xl" style={{ background: bg }}
          animate={{ rotate: rot }} transition={{ duration: 4.5, ease: [0.12, 0.7, 0.15, 1] }}
          onAnimationComplete={() => { if (busy) { setBusy(false); onPick(target.current) } }}>
          {items.map((it, k) => (
            <div key={it.id} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transform: `rotate(${k * seg + seg / 2 - 90}deg)` }}>
              <span className="absolute -translate-y-1/2 truncate text-sm font-extrabold text-night" style={{ left: size * 0.12, width: size * 0.34 }}>{it.name}</span>
            </div>
          ))}
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-night" />
        </motion.div>
      </div>
      <button className="btn w-full max-w-xs text-lg" onClick={spin} disabled={busy}>{busy ? 'Spinning…' : 'Spin for next speaker'}</button>
    </div>
  )
}
