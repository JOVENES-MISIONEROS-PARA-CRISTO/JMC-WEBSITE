import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SECCIONES } from '@/data/site'

export function SectionMenu() {
  const marker = useRef<HTMLSpanElement>(null)
  const destination = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.jmc-content > section[id], .jmc-home footer[id]')
    let frame = 0
    const update = () => {
      frame = 0
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

  useEffect(() => {
    if (!marker.current) return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0)
    })
    observer.observe(marker.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <span ref={marker} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-[35svh] w-px" />
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button" hidden={!visible} className="section-menu-trigger fixed z-40 items-center gap-2 rounded-full px-4 py-3 font-semibold text-jmc-morado shadow-lg">
            <Menu size={20} aria-hidden="true" /> Menú
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-jmc-noche/35" />
          <Dialog.Content
            aria-describedby={undefined}
            className="section-menu-panel fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] overflow-y-auto p-6 text-jmc-noche shadow-xl"
            onCloseAutoFocus={event => {
              const target = destination.current
              if (!target) return
              event.preventDefault()
              target.focus({ preventScroll: true })
              destination.current = null
            }}
          >
            <div className="relative mb-6 grid justify-items-center gap-3">
              <img src="/logos/jmc_solo_icono.png" alt="Jóvenes Misioneros para Cristo" className="size-24 object-contain" />
              <Dialog.Title className="text-xl font-bold">Secciones</Dialog.Title>
              <Dialog.Close aria-label="Cerrar menú" className="absolute top-0 right-0 grid size-11 place-items-center rounded-full text-jmc-morado hover:bg-jmc-morado/10">
                <X size={22} aria-hidden="true" />
              </Dialog.Close>
            </div>
            <nav aria-label="Menú de secciones" className="grid gap-1">
              {SECCIONES.map(([id, label]) => (
                <Dialog.Close asChild key={id}>
                  <a href={`#${id}`} aria-current={activeId === id ? 'location' : undefined} className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-semibold text-jmc-morado hover:bg-jmc-morado/10"
                    onClick={() => {
                      const target = document.getElementById(id)
                      if (target) target.tabIndex = -1
                      destination.current = target
                    }}>
                    <img src={`/icons/${id}.svg`} alt="" width="20" height="20" />
                    {label}
                  </a>
                </Dialog.Close>
              ))}
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
