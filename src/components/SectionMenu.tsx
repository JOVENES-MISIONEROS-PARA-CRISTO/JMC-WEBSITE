import { useEffect, useState } from 'react'
import { SECCIONES } from '@/data/site'

const headerSections = [['inicio', 'Inicio'], ...SECCIONES.filter(([id]) => id !== 'unete')] as const

export function SectionMenu() {
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const inicio = document.getElementById('inicio')
    const sections = document.querySelectorAll<HTMLElement>('.jmc-content > section[id], .jmc-home footer[id]')
    let frame = 0
    const update = () => {
      frame = 0
      setVisible(inicio !== null && inicio.getBoundingClientRect().bottom <= 0)
      const readingLine = window.innerHeight / 3
      let current = ''
      for (const section of sections) {
        if (section.getBoundingClientRect().top > readingLine) break
        current = section.id
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1]?.id ?? current
      }
      setActiveId(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    sections.forEach(section => observer.observe(section))
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header hidden={!visible} className="section-menu-header fixed inset-x-0 top-0 z-40 items-center gap-3 border-b border-jmc-morado/10 px-3 py-2 text-jmc-morado sm:gap-6 sm:px-6 sm:py-3">
      <a href="#inicio" className="inline-flex shrink-0 items-center gap-2 font-bold">
        <img src="/logos/jmc_solo_icono.png" alt="" className="size-9 object-contain" />
        JMC
      </a>
      <nav aria-label="Secciones" className="flex min-w-0 gap-4 overflow-x-auto sm:gap-7">
        {headerSections.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={activeId === id ? 'location' : undefined}
            className="relative flex min-h-11 shrink-0 items-center px-1 text-sm font-medium text-jmc-noche hover:text-jmc-morado focus-visible:outline-offset-[-2px]">
            {label}
          </a>
        ))}
      </nav>
      <a href="#unete" aria-current={activeId === 'unete' ? 'location' : undefined}
        className="inline-flex min-h-11 items-center justify-self-end gap-3 rounded-full border border-jmc-morado/25 bg-jmc-rosa/10 px-4 text-sm font-semibold hover:bg-jmc-rosa/20 sm:px-6">
        Únete <span aria-hidden="true">↗</span>
      </a>
    </header>
  )
}
