import { useEffect, useRef, useState } from 'react'
import { PROFILE, SKILLS, PROJECTS, ART, LINKS } from './data'

/* Тема из арта: берём цвет фона картинки и строим из него палитру */
const toHsl = (r, g, b) => { r /= 255; g /= 255; b /= 255; const M = Math.max(r, g, b), m = Math.min(r, g, b), l = (M + m) / 2, d = M - m; let h = 0, s = 0; if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = M === r ? (g - b) / d + (g < b ? 6 : 0) : M === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6 } return [h, s, l] }
const toRgb = (h, s, l) => { const a = s * Math.min(l, 1 - l), f = (n) => { const k = (n + h * 12) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)) }; return [f(0), f(8), f(4)].map((v) => Math.round(v * 255)) }
export function applyAccent(src) {
  const img = new Image()
  img.onload = () => {
    const c = document.createElement('canvas'); c.width = c.height = 8
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, img.width * 0.12, img.height * 0.25, 0, 0, 8, 8)
    const d = x.getImageData(0, 0, 8, 8).data; let r = 0, g = 0, b = 0
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2] }
    const n = d.length / 4, [h, s0, l0] = toHsl(r / n, g / n, b / n)
    const s = Math.max(s0, 0.75), l = Math.min(Math.max(l0, 0.38), 0.5)
    const set = (k, L, S = s) => document.documentElement.style.setProperty('--s' + k, toRgb(h, S, L).join(' '))
    set(300, 0.72, 1); set(400, 0.62, 1); set(500, l); set(600, l - 0.08); set(700, l - 0.18); set(900, 0.14, s * 0.8)
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', `rgb(${toRgb(h, s, l).join(',')})`)
  }
  img.src = src
}

/* Интро: алая шторка со счётчиком, потом уезжает вверх */
export function Loader({ onDone }) {
  const [n, setN] = useState(0)
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 1500
    const t0 = performance.now()
    let raf
    document.body.style.overflow = 'hidden'
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else { setOut(true); onDone(); document.body.style.overflow = ''; setTimeout(() => setGone(true), 1100) }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  if (gone) return null
  return (
    <div className={`fixed inset-0 z-[100] grid place-items-center bg-scarlet-500 transition-transform duration-[1000ms] ease-[cubic-bezier(.76,0,.24,1)] ${out ? '-translate-y-full' : ''}`}>
      <div className="text-center">
        <div className="font-display text-[clamp(5rem,22vw,14rem)] font-extrabold leading-none tabular-nums text-white">{n}</div>
        <div className="mx-auto mt-6 h-[3px] w-48 bg-wine-950/30"><div className="h-full bg-white" style={{ width: n + '%' }} /></div>
        <p className="mt-4 font-display text-sm text-bone">{PROFILE.name}</p>
      </div>
    </div>
  )
}

/* Кольцо-курсор: растёт над ссылками и кнопками */
export function Cursor() {
  const ring = useRef(null)
  useEffect(() => {
    if (!matchMedia('(hover: hover)').matches) return
    let x = -100, y = -100, rx = -100, ry = -100, s = 1, raf
    const m = (e) => { x = e.clientX; y = e.clientY; s = e.target.closest?.('a,button,[data-hover]') ? 1.9 : 1 }
    const tick = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18
      ring.current.style.transform = `translate3d(${rx - 18}px,${ry - 18}px,0) scale(${s})`
      raf = requestAnimationFrame(tick)
    }
    addEventListener('mousemove', m); raf = requestAnimationFrame(tick)
    return () => { removeEventListener('mousemove', m); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-9 w-9 rounded-full border-2 border-white mix-blend-difference [@media(hover:hover)]:block" />
}

/* Магнитная обёртка: элемент тянется к курсору */
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null)
  const mv = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px,${(e.clientY - r.top - r.height / 2) * strength}px)`
  }
  return <div ref={ref} onMouseMove={mv} onMouseLeave={() => (ref.current.style.transform = '')} className="inline-block transition-transform duration-200 ease-out">{children}</div>
}

/* Плавающее меню с подсветкой текущей секции */
const NAV = [['about', 'Обо мне'], ['projects', 'Проекты'], ['art', 'Арт'], ['terminal', 'Терминал'], ['contact', 'Контакты']]
export function Nav() {
  const [a, setA] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setA(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    NAV.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])
  return (
    <nav className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-bone/20 bg-wine-950/70 p-1 text-xs backdrop-blur-md sm:text-sm">
      {NAV.map(([id, label]) => (
        <a key={id} href={'#' + id} className={`rounded-full px-2.5 py-1.5 transition-colors sm:px-4 ${a === id ? 'bg-scarlet-500 text-white' : 'text-bone/80 hover:text-white'}`}>{label}</a>
      ))}
    </nav>
  )
}

/* Живой терминал: команды работают по-настоящему */
const NEO = `      /\\            zerox@arch
     /  \\           ----------
    /    \\          OS: Arch Linux
   /  ,,  \\         WM: Hyprland
  /  |  |  \\        Стек: ${SKILLS.slice(0, 4).join(', ')}
 /_-''    ''-_\\     Проектов: ${PROJECTS.length}
                    Цвет: алый`
const CMD = {
  help: () => 'Команды: whoami, neofetch, skills, projects, art, contact, ls, clear\nПодсказка: стрелка вверх возвращает прошлую команду',
  whoami: () => `${PROFILE.name} — ${PROFILE.roles.join(', ')}`,
  neofetch: () => NEO,
  skills: () => SKILLS.join('   '),
  projects: () => PROJECTS.map((p, i) => `${i + 1}. ${p.title} — ${p.text}`).join('\n'),
  art: () => `В галерее ${ART.length} артов. Загляни в секцию «Атмосфера».`,
  contact: () => LINKS.map((l) => `${l.label}: ${l.href}`).join('\n'),
  ls: () => 'about/  projects/  art/  terminal/  contact/',
  sudo: () => 'zerox is not in the sudoers file. This incident will be reported.',
}

export function Terminal() {
  const [lines, setLines] = useState([{ c: 'neofetch', o: NEO }, { c: 'help', o: CMD.help() }])
  const [val, setVal] = useState('')
  const [hist, setHist] = useState(-1)
  const body = useRef(null), input = useRef(null)
  useEffect(() => { if (lines.length > 2) body.current.scrollTop = body.current.scrollHeight }, [lines])

  const run = (raw) => {
    const c = raw.trim()
    if (!c) return
    const name = c.split(' ')[0].toLowerCase()
    if (name === 'clear') return setLines([])
    setLines((l) => [...l, { c, o: CMD[name] ? CMD[name]() : `command not found: ${name}. Попробуй help` }])
    setHist(-1)
  }
  const onKey = (e) => {
    if (e.key === 'Enter') { run(val); setVal('') }
    if (e.key === 'ArrowUp') {
      const past = lines.map((l) => l.c)
      const i = Math.min(hist + 1, past.length - 1)
      if (past.length) { setHist(i); setVal(past[past.length - 1 - i]); e.preventDefault() }
    }
  }
  return (
    <div onClick={() => input.current.focus({ preventScroll: true })} data-hover
      className="overflow-hidden rounded-2xl border border-scarlet-500/60 bg-wine-950 font-mono text-sm shadow-[0_0_70px_rgb(var(--s500)/.25)]">
      <div className="flex items-center gap-2 border-b border-scarlet-700/60 bg-wine-800 px-4 py-3">
        <i className="h-3 w-3 rounded-full bg-scarlet-500" /><i className="h-3 w-3 rounded-full bg-scarlet-400/60" /><i className="h-3 w-3 rounded-full bg-bone/30" />
        <span className="ml-3 text-bone/60">zerox@arch: ~</span>
      </div>
      <div ref={body} className="h-[22rem] overflow-y-auto p-5 leading-relaxed text-bone/90">
        {lines.map((l, i) => (
          <div key={i} className="mb-3">
            <div><span className="text-scarlet-400">zerox@arch</span> <span className="text-bone/50">~$</span> {l.c}</div>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-bone/80">{l.o}</pre>
          </div>
        ))}
        <label className="flex gap-2">
          <span><span className="text-scarlet-400">zerox@arch</span> <span className="text-bone/50">~$</span></span>
          <input ref={input} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={onKey} aria-label="Командная строка"
            autoCapitalize="off" autoCorrect="off" spellCheck={false} className="min-w-0 flex-1 bg-transparent caret-scarlet-400 outline-none" />
        </label>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-scarlet-700/60 bg-wine-800 px-4 py-3">
        {['help', 'neofetch', 'whoami', 'projects', 'skills', 'sudo'].map((c) => (
          <button key={c} onClick={(e) => { e.stopPropagation(); run(c) }} className="rounded-md bg-scarlet-600/25 px-3 py-1 text-scarlet-300 transition hover:bg-scarlet-500 hover:text-white">{c}</button>
        ))}
      </div>
    </div>
  )
}
