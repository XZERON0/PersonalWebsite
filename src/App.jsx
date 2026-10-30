import { useEffect, useRef, useState } from 'react'
import { PROFILE, SKILLS, PROJECTS, ART, LINKS } from './data'
import { Loader, Cursor, Magnetic, Nav, Terminal, applyAccent } from './extras'

/* ───────── хуки ───────── */

// печатная машинка для ролей
function useTypewriter(words) {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [erasing, setErasing] = useState(false)
  useEffect(() => {
    const word = words[i]
    let delay = erasing ? 35 : 70
    if (!erasing && text === word) delay = 1500
    const id = setTimeout(() => {
      if (!erasing && text === word) setErasing(true)
      else if (erasing && text === '') { setErasing(false); setI((i + 1) % words.length) }
      else setText(erasing ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
    }, delay)
    return () => clearTimeout(id)
  }, [text, erasing, i, words])
  return text
}

// плавное появление блока при скролле
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (el.classList.add('in'), io.disconnect()), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/* ───────── эффекты ───────── */

// подсветка за курсором + полоса прогресса скролла
function Chrome() {
  const bar = useRef(null)
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px')
      document.documentElement.style.setProperty('--my', e.clientY + 'px')
    }
    const scroll = () => {
      const h = document.documentElement
      bar.current.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('scroll', scroll, { passive: true })
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('scroll', scroll) }
  }, [])
  return (
    <>
      <div ref={bar} className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-scarlet-600 via-scarlet-400 to-bone" />
      <div className="cursor-glow pointer-events-none fixed inset-0 z-40" />
    </>
  )
}

// искры, поднимающиеся вверх
function Embers() {
  const ref = useRef(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c = ref.current, ctx = c.getContext('2d')
    let w, h, raf, col = '255,90,60', f = 0
    const resize = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const mk = () => ({ x: Math.random() * w, y: h + Math.random() * h, r: Math.random() * 2.2 + 0.6, v: Math.random() * 0.6 + 0.25, s: Math.random() * 6 })
    const ps = Array.from({ length: 70 }, mk)
    const tick = (t) => {
      ctx.clearRect(0, 0, w, h)
      if (f++ % 30 === 0) col = getComputedStyle(document.documentElement).getPropertyValue('--s400').trim().split(' ').join(',')
      for (const p of ps) {
        p.y -= p.v; p.x += Math.sin(t / 900 + p.s) * 0.35
        if (p.y < -10) Object.assign(p, mk(), { y: h + 10 })
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7)
        ctx.fillStyle = `rgba(${col},${0.2 + p.r / 4})`
        ctx.shadowColor = `rgb(${col})`; ctx.shadowBlur = 10; ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />
}

// 3D-наклон за курсором
function Tilt({ children, className = '', max = 10 }) {
  const ref = useRef(null)
  const on = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    ref.current.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) scale(1.02)`
    ref.current.style.setProperty('--gx', x * 100 + '%'); ref.current.style.setProperty('--gy', y * 100 + '%')
  }
  const off = () => (ref.current.style.transform = '')
  return (
    <div ref={ref} onMouseMove={on} onMouseLeave={off} className={`transition-transform duration-200 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  )
}

/* ───────── секции ───────── */

function Hero({ art }) {
  const role = useTypewriter(PROFILE.roles)
  const img = useRef(null)
  // параллакс: арт плывёт за мышью и чуть медленнее скролла
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let mx = 0, my = 0
    const apply = () => { img.current.style.transform = `translate3d(${mx * -26}px,${my * -14 + scrollY * 0.12}px,0) scale(1.08)` }
    const m = (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; apply() }
    addEventListener('mousemove', m); addEventListener('scroll', apply, { passive: true }); apply()
    return () => { removeEventListener('mousemove', m); removeEventListener('scroll', apply) }
  }, [art.src])
  return (
    <header id="top" className="relative isolate flex min-h-screen items-center overflow-hidden bg-scarlet-500">
      {/* арт: красный фон картинки сливается с цветом секции */}
      <img ref={img} key={art.src} style={{ objectPosition: `${art.pos} center` }}
        src={art.src} alt="" fetchpriority="high"
        className="animate-fade transition-transform duration-300 ease-out absolute inset-y-0 right-0 -z-10 h-full w-full object-cover opacity-60 md:w-[72%] md:opacity-100 md:[mask-image:linear-gradient(to_right,transparent,#000_40%)]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-wine-950 via-transparent to-transparent" />
      <Embers />
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28">
        <p className="mb-4 h-7 text-lg font-medium text-bone/90 md:text-xl">
          Привет, я <span className="text-white">{role}</span><span className="ml-0.5 animate-pulse">|</span>
        </p>
        <h1 data-text={PROFILE.name} className="glitch font-display text-[clamp(4.5rem,18vw,13rem)] font-extrabold leading-[0.85] tracking-tight text-white">
          {PROFILE.name.split('').map((ch, i) => (
            <span key={i} className="inline-block animate-drop" style={{ animationDelay: `${i * 90 + 150}ms` }}>{ch}</span>
          ))}
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-bone">
          Собираю проекты, настраиваю Linux под себя и довожу всё до деплоя.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Magnetic><a href="#projects" className="rounded-full bg-wine-950 px-7 py-3 font-bold text-bone transition hover:-translate-y-1 hover:bg-white hover:text-scarlet-600">Смотреть проекты</a></Magnetic>
          <Magnetic><a href="#contact" className="rounded-full border-2 border-bone/70 px-7 py-3 font-bold text-bone transition hover:-translate-y-1 hover:bg-bone hover:text-scarlet-600">Написать мне</a></Magnetic>
        </div>
      </div>
    </header>
  )
}

function Marquee() {
  const items = [...SKILLS, ...SKILLS]
  return (
    <div className="relative overflow-hidden border-y-2 border-scarlet-700/60 bg-wine-900 py-5">
      {/* Верхняя декоративная граница */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-scarlet-400 to-transparent" />
      {/* Нижняя декоративная граница */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-scarlet-400 to-transparent" />

      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl font-medium text-bone/80 hover:[animation-play-state:paused]">
        {items.map((s, i) => (
          <span key={i} className="flex items-center gap-10">{s}<i className="inline-block h-2.5 w-2.5 rotate-45 bg-scarlet-500" /></span>
        ))}
      </div>
    </div>
  )
}

function Title({ children, sub }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal mb-14">
      <h2 className="font-display text-4xl font-extrabold md:text-6xl">{children}</h2>
      {sub && <p className="mt-4 max-w-xl text-bone/70">{sub}</p>}
    </div>
  )
}

// Анимированный киберпанк декор
function CyberDecor() {
  const [lines, setLines] = useState([])
  useEffect(() => {
    const generateLines = () => {
      return Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        width: Math.random() * 60 + 20,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 2
      }))
    }
    setLines(generateLines())
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      {lines.map((line) => (
        <div
          key={line.id}
          className="absolute h-[2px] bg-gradient-to-r from-transparent via-scarlet-400 to-transparent"
          style={{
            left: `${line.x}%`,
            top: `${line.y}%`,
            width: `${line.width}%`,
            animation: `glitch-line ${line.duration}s ${line.delay}s ease-in-out infinite`
          }}
        />
      ))}
    </div>
  )
}

function About() {
  const ref = useReveal()
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28 overflow-hidden">
      {/* Верхняя граница секции */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-scarlet-500 to-transparent opacity-60" />

      {/* Киберпанк декор */}
      <CyberDecor />
      <div className="absolute top-10 right-10 w-64 h-64 bg-scarlet-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-scarlet-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div ref={ref} className="reveal grid items-center gap-14 md:grid-cols-[5fr_6fr] relative z-10">
        <Tilt max={8} className="group relative">
          <div className="absolute -inset-3 -z-10 rotate-2 rounded-3xl bg-scarlet-500 opacity-70 blur-xl animate-glow" />
          {/* Анимированная рамка */}
          <div className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-scarlet-400 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-scarlet-400 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%', animationDelay: '1s' }} />
            <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-scarlet-400 to-transparent animate-shimmer" style={{ backgroundSize: '100% 200%', animationDelay: '0.5s' }} />
            <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-scarlet-400 to-transparent animate-shimmer" style={{ backgroundSize: '100% 200%', animationDelay: '1.5s' }} />
          </div>
          <img src="/art/white.webp" alt="Девушка с белыми волосами и татуировками на красном фоне" loading="lazy"
            className="aspect-[4/5] w-full rounded-3xl object-cover object-[62%_center] relative z-10" />
        </Tilt>
        <div>
          <h2 className="font-display text-4xl font-extrabold md:text-6xl relative">
            Немного <span className="outline-text">обо мне</span>
            {/* Глитч декор на заголовке */}
            <span className="absolute -right-8 -top-4 text-scarlet-500 opacity-20 animate-pulse text-6xl font-mono">&gt;&gt;</span>
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-bone/80">
            {PROFILE.about.map((p, i) => (
              <p key={p} className="relative pl-4 border-l-2 border-scarlet-500/30 hover:border-scarlet-500 transition-colors duration-300">
                <span className="absolute -left-[5px] top-0 w-2 h-2 bg-scarlet-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                {p}
              </p>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap gap-3">
            {PROFILE.facts.map((f, i) => (
              <li key={f} className="rounded-full border border-scarlet-500/60 bg-scarlet-900/50 px-4 py-2 text-sm text-bone hover:bg-scarlet-500/30 hover:border-scarlet-400 transition-all duration-300 hover:-translate-y-1 cursor-default" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="inline-block mr-1.5 text-scarlet-400">▸</span>{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Нижняя граница секции */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-scarlet-500 to-transparent opacity-60" />
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="relative bg-wine-900 py-28 overflow-hidden">
      {/* GIF с Резе как фон */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img
          src="/gif/reze.gif"
          alt=""
          className="w-[60%] h-auto object-contain opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-wine-900/40 via-transparent to-wine-900/40" />
      </div>

      {/* Сетка поверх */}
      <div className="absolute inset-0 z-[5] opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(242, 34, 14, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(242, 34, 14, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Верхняя граница */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="h-1 bg-gradient-to-r from-transparent via-scarlet-500 to-transparent" />
        <div className="h-[2px] bg-scarlet-500/60" />
        <div className="h-8 bg-gradient-to-b from-scarlet-500/20 to-transparent" />
      </div>

      {/* Нижняя граница */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="h-8 bg-gradient-to-t from-scarlet-500/20 to-transparent" />
        <div className="h-[2px] bg-scarlet-500/60" />
        <div className="h-1 bg-gradient-to-r from-transparent via-scarlet-500 to-transparent" />
      </div>

      {/* Боковые акценты */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-scarlet-500/40 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-scarlet-500/40 to-transparent z-10" />

      {/* Анимированные частицы по краям */}
      <div className="absolute top-0 left-1/4 w-2 h-2 bg-scarlet-400 rounded-full animate-pulse z-10" />
      <div className="absolute top-0 right-1/3 w-2 h-2 bg-scarlet-400 rounded-full animate-pulse z-10" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-0 left-1/3 w-2 h-2 bg-scarlet-400 rounded-full animate-pulse z-10" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-scarlet-400 rounded-full animate-pulse z-10" style={{ animationDelay: '1.5s' }} />

      <div className="mx-auto max-w-6xl px-6 relative z-20">
        <Title sub="Всё, что я делаю для себя и в портфолио. Наведи на карточку.">Проекты</Title>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <Tilt key={p.title}>
              <a href={p.href} className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-scarlet-700/70 bg-wine-800/90 backdrop-blur-sm p-7 transition-colors hover:border-scarlet-400">
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
                  style={{ background: 'radial-gradient(260px circle at var(--gx,50%) var(--gy,50%), rgb(var(--s500) / .28), transparent 70%)' }} />
                <h3 className="relative font-display text-xl font-medium">{p.title}</h3>
                <p className="relative mt-3 flex-1 leading-relaxed text-bone/70">{p.text}</p>
                <div className="relative mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => <span key={t} className="rounded-md bg-scarlet-600/25 px-2.5 py-1 text-xs text-scarlet-300">{t}</span>)}
                </div>
              </a>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  )
}

function Gallery({ active, onApply }) {
  const [open, setOpen] = useState(null)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  return (
    <section id="art" className="relative py-28">
      {/* Верхняя граница */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="h-1 bg-gradient-to-r from-transparent via-scarlet-500 to-transparent" />
        <div className="h-[2px] bg-scarlet-500/60" />
        <div className="h-6 bg-gradient-to-b from-scarlet-500/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6 relative z-10"><Title sub="Арты, из которых растёт стиль этой страницы. Листай вбок, кликай, чтобы открыть.">Атмосфера</Title></div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
        {ART.map((a, i) => (
          <button key={a.src} onClick={() => setOpen(a)} aria-label={`Открыть: ${a.alt}`}
            className={`group relative h-[56vh] min-h-[320px] shrink-0 snap-center overflow-hidden rounded-3xl ${i % 2 ? 'mt-10' : ''}`}>
            <img src={a.src} alt={a.alt} loading="lazy" className="h-full w-auto max-w-none object-cover transition duration-700 group-hover:scale-110" />
            <span className="absolute inset-0 bg-gradient-to-t from-scarlet-700/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {a.src === active && <span className="absolute left-3 top-3 rounded-full bg-scarlet-500 px-3 py-1 text-xs font-bold text-white">на странице</span>}
          </button>
        ))}
      </div>
      {open && (
        <div onClick={() => setOpen(null)} role="dialog" aria-modal="true"
          className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-wine-950/95 p-4 backdrop-blur-sm">
          <div onClick={(e) => e.stopPropagation()} className="flex max-h-full cursor-default flex-col items-center gap-5">
            <img src={open.src} alt={open.alt} className="max-h-[76vh] max-w-full rounded-2xl shadow-[0_0_80px_rgb(var(--s500)/.45)]" />
            {open.src === active
              ? <p className="text-bone/70">Этот арт сейчас на странице</p>
              : <button onClick={() => { onApply(open); setOpen(null) }} className="rounded-full bg-scarlet-500 px-7 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-white hover:text-scarlet-600">Применить к странице</button>}
          </div>
        </div>
      )}
    </section>
  )
}

function TerminalSection() {
  return (
    <section id="terminal" className="relative mx-auto max-w-4xl px-6 pb-28">
      {/* Верхняя граница */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-scarlet-500/50 to-transparent" />

      <Title sub="Да, он рабочий. Жми кнопки или печатай команды сам.">Терминал</Title>
      <Terminal />
    </section>
  )
}

function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-scarlet-500 py-28 text-center">
      <img src="/art/oni.webp" alt="" loading="lazy" className="absolute inset-0 -z-0 h-full w-full object-cover opacity-25 mix-blend-multiply" />
      <div className="relative mx-auto max-w-4xl px-6">
        <h2 className="font-display text-[clamp(2.5rem,9vw,6.5rem)] font-extrabold leading-none text-white">Давай сделаем что-нибудь</h2>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
              className="rounded-full bg-wine-950 px-8 py-3.5 font-bold text-bone transition hover:-translate-y-1 hover:bg-white hover:text-scarlet-600">{l.label}</a>
          ))}
        </div>
        <p className="mt-16 text-sm text-bone/80">© {new Date().getFullYear()} {PROFILE.name}</p>
      </div>
    </footer>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [art, setArt] = useState(() => {
    try { return ART.find((a) => a.src === localStorage.getItem('art')) || ART[0] } catch { return ART[0] }
  })

  useEffect(() => {
    applyAccent(art.src)
    try { localStorage.setItem('art', art.src) } catch {}
  }, [art])

  // Автоматическая смена артов каждые 8 секунд
  useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(() => {
      setArt((current) => {
        const currentIndex = ART.findIndex((a) => a.src === current.src)
        const nextIndex = (currentIndex + 1) % ART.length
        return ART[nextIndex]
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [autoPlay])

  const apply = (a) => {
    setArt(a); setToast(true); scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => setToast(false), 2600)
  }
  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Chrome />
      {ready && <Nav />}
      {ready && <Hero art={art} />}
      {/* Кнопка управления автосменой артов */}
      <button
        onClick={() => setAutoPlay(!autoPlay)}
        className="fixed right-6 top-20 z-50 rounded-full bg-wine-950/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-bone border border-scarlet-500/40 hover:bg-scarlet-500 hover:border-scarlet-400 transition-all duration-300 hover:shadow-lg hover:shadow-scarlet-500/30"
        title={autoPlay ? "Остановить автосмену" : "Запустить автосмену"}
      >
        {autoPlay ? '⏸ Пауза' : '▶ Авто'}
      </button>
      <Marquee />
      <About />
      <Projects />
      <Gallery active={art.src} onApply={apply} />
      <TerminalSection />
      <Contact />
      <div role="status" className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-wine-950 px-6 py-3 text-sm text-bone shadow-[0_0_40px_rgb(var(--s500)/.5)] transition-all duration-500 ${toast ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        Тема обновлена под выбранный арт
      </div>
    </>
  )
}
