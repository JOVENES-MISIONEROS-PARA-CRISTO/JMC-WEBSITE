import { useEffect, useRef, type MouseEvent } from 'react'
import { SectionMenu } from '@/components/SectionMenu'
import { About } from '@/sections/About'
import { Activities } from '@/sections/Activities'
import { Events } from '@/sections/Events'
import { Contact } from '@/sections/Contact'
import { Gallery } from '@/sections/Gallery'
import { Hero } from '@/sections/Hero'

export default function Home() {
  const frame = useRef(0)

  useEffect(() => {
    const cancel = () => cancelAnimationFrame(frame.current)
    const events = ['wheel', 'touchstart', 'keydown', 'popstate'] as const
    events.forEach(type => window.addEventListener(type, cancel, { passive: true }))
    return () => {
      cancel()
      events.forEach(type => window.removeEventListener(type, cancel))
    }
  }, [])

  function scrollToSection(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target instanceof Element && event.target.closest<HTMLAnchorElement>('a[href^="#"]')
    const section = link && document.getElementById(link.hash.slice(1))
    if (!section) return
    cancelAnimationFrame(frame.current)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    event.preventDefault()
    if (location.hash !== link.hash) history.pushState(history.state, '', link.hash)
    const start = window.scrollY
    const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0
    const end = Math.max(0, Math.min(start + section.getBoundingClientRect().top - margin,
      document.documentElement.scrollHeight - window.innerHeight))
    const distance = end - start
    const duration = Math.min(2880, 1440 + Math.abs(distance) * 0.216)
    const started = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - started) / duration))
      window.scrollTo({ top: start + distance * t * t * (3 - 2 * t), behavior: 'instant' })
      if (t < 1) frame.current = requestAnimationFrame(step)
      else {
        if (!section.hasAttribute('tabindex')) section.tabIndex = -1
        section.focus({ preventScroll: true })
      }
    }
    frame.current = requestAnimationFrame(step)
  }

  return (
    <div className="jmc-home" onClick={scrollToSection}>
      <SectionMenu />
      <main className="jmc-content">
        <Hero />
        <About />
        <Activities />
        <Events />
        <Gallery />
        <Contact />
      </main>
    </div>
  )
}
