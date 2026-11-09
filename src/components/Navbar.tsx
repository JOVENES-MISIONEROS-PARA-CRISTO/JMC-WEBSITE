import { Menu, X } from 'lucide-react'
import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

const LINKS = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#actividades', label: 'Actividades' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#galeria', label: 'Galería' },
  { href: '#contacto', label: 'Contacto' },
  { href: '#unete', label: 'Únete' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const reduceMotion = useReducedMotion()
  const scrollFrame = useRef(0)

  useEffect(() => {
    const cancel = () => cancelAnimationFrame(scrollFrame.current)
    const onKey = (event: KeyboardEvent) => {
      if (['Escape', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancel()
    }
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      cancel()
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const hash = event.currentTarget.hash
    const target = document.getElementById(hash.slice(1))
    if (!target) return
    event.preventDefault()
    setOpen(false)
    cancelAnimationFrame(scrollFrame.current)
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
    // Measure after the mobile menu has closed.
    scrollFrame.current = requestAnimationFrame(() => {
      const start = window.scrollY
      const offset = (header.current?.getBoundingClientRect().height ?? 72) + 16
      const end = Math.max(0, Math.min(start + target.getBoundingClientRect().top - offset, document.documentElement.scrollHeight - window.innerHeight))
      const duration = reduceMotion ? 0 : 1100
      const began = performance.now()
      const step = (now: number) => {
        const progress = duration ? Math.min((now - began) / duration, 1) : 1
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
        window.scrollTo({ top: start + (end - start) * eased, behavior: 'instant' })
        if (progress < 1) scrollFrame.current = requestAnimationFrame(step)
        else {
          const hadTabIndex = target.hasAttribute('tabindex')
          if (!hadTabIndex) target.setAttribute('tabindex', '-1')
          target.focus({ preventScroll: true })
          if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
        }
      }
      scrollFrame.current = requestAnimationFrame(step)
    })
  }

  useEffect(() => {
    let frame = 0
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.jmc-content > section[id], .jmc-home footer[id]'))
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 8)
      const marker = Math.max(96, window.innerHeight * 0.3)
      let current = ''
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id
      }
      // The footer can be too short to reach the marker before the page ends.
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections.at(-1)?.id ?? current
      }
      setActive(current)
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])
  const header = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width: 1024px)')
    const resize = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', resize)
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      desktop.removeEventListener('change', resize)
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  return (
    <header ref={header} className="jmc-topbar" data-scrolled={scrolled} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
    }}>
      <div className="jmc-topbar-inner">
        <a href="#inicio" className="jmc-topbar-brand" onClick={navigate} aria-label="JMC, ir al inicio">
          <img src="/logos/jmc_solo_icono.png" alt="" />
          <span>Jóvenes Misioneros para Cristo</span>
        </a>
        <button ref={trigger} type="button" className="jmc-topbar-toggle jmc-glass-button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="jmc-topbar-links" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav id="jmc-topbar-links" aria-label="Principal" className="jmc-topbar-links" data-open={open}>
          <LayoutGroup id="header-navigation">
            {LINKS.map(({ href, label }) => (
              <motion.a
                key={href}
                href={href}
                aria-current={active === href.slice(1) ? 'location' : undefined}
                onClick={navigate}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              >
                {active === href.slice(1) && (
                  <motion.span
                    className="jmc-nav-indicator"
                    aria-hidden="true"
                    layoutId={reduceMotion ? undefined : 'active-section'}
                    transition={reduceMotion ? { duration: 0 } : { type: 'tween', duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="jmc-nav-label">{label}</span>
              </motion.a>
            ))}
          </LayoutGroup>
        </nav>
      </div>
    </header>
  )
}
