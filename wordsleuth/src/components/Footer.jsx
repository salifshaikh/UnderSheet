// 👉 Put your real links here
const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/salifshaikh',
    icon: <path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" /> },
  { label: 'GitHub', href: 'https://github.com/salifshaikh',
    icon: <path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /> },
  { label: 'Portfolio', href: 'https://my-portfolio-gamma-nine-22.vercel.app/',
    icon: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></g> },
]

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-line px-5 py-6 text-center text-sm text-[#a99fd6]">
      <p>Game developed by <span className="font-extrabold text-[#f3efff]">Salif Shaikh</span></p>
      <div className="mt-3 flex justify-center gap-3">
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} title={l.label}
            className="rounded-full border border-line p-2 transition hover:border-amber hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint">
            <svg viewBox="0 0 24 24" className="h-5 w-5">{l.icon}</svg>
          </a>
        ))}
      </div>
    </footer>
  )
}