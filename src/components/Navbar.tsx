import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

const LINKS = [
  { href: '#nosotros', label: 'Quiénes somos', icon: 'nosotros' },
  { href: '#actividades', label: 'Actividades', icon: 'actividades' },
  { href: '#eventos', label: 'Eventos', icon: 'eventos' },
  { href: '#galeria', label: 'Galería', icon: 'galeria' },
  { href: '#contacto', label: 'Contacto', icon: 'contacto' },
]

function SidebarIcon({ name, className = 'size-5' }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{ mask: `url(/icons/${name}.svg) center / contain no-repeat`, WebkitMask: `url(/icons/${name}.svg) center / contain no-repeat` }}
    />
  )
}

function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Principal" className="flex flex-1 flex-col gap-8">
      <a href="#inicio" onClick={onNavigate} className="flex items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-jmc-morado" aria-label="JMC, ir al inicio">
        <img src="/logos/jmc_solo_icono.png" alt="" className="h-28 w-auto" />
      </a>
      <ul className="space-y-2">
        {LINKS.map(({ href, label, icon }) => (
          <li key={href}>
            <a href={href} onClick={onNavigate} className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-jmc-noche transition hover:bg-white/30 hover:text-jmc-morado focus-visible:outline-2 focus-visible:outline-jmc-morado">
              <SidebarIcon name={icon} className="size-5 text-jmc-morado" />
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Button asChild className="w-full">
          <a href="#unete" onClick={onNavigate}><SidebarIcon name="unete" className="size-4" />¡Únete!</a>
        </Button>
      </div>
    </nav>
  )
}

export function Navbar({ sidebarVisible, onToggleSidebar }: { sidebarVisible: boolean; onToggleSidebar: () => void }) {
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => { if (desktop.matches) setAbierto(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-controls="desktop-sidebar"
        aria-expanded={sidebarVisible}
        aria-label={sidebarVisible ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
        title={sidebarVisible ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
        className={`fixed top-4 z-50 hidden items-center gap-2 rounded-full border border-white/30 bg-[#c6a0d9]/95 p-3 text-jmc-morado shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-[#dc9bc9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jmc-morado lg:flex ${sidebarVisible ? 'left-44' : 'left-4'}`}
      >
        <SidebarIcon name="sidebar_icon" />
        {!sidebarVisible && <span className="pr-1 text-sm font-semibold">Menú</span>}
      </button>
      <aside id="desktop-sidebar" inert={!sidebarVisible} aria-hidden={!sidebarVisible} className={`fixed inset-y-0 left-0 z-40 hidden w-60 flex-col overflow-y-auto border-r border-white/20 bg-gradient-to-b from-[#c6a0d9] via-[#c998d4] to-[#dc9bc9] p-5 pt-20 shadow-xl shadow-jmc-morado/10 transition-transform duration-300 lg:flex ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarLinks />
      </aside>
      <Dialog.Root open={abierto} onOpenChange={setAbierto}>
        <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-[#c6a0d9]/85 px-5 backdrop-blur-xl lg:hidden">
          <a href="#inicio" aria-label="JMC, ir al inicio">
            <img src="/logos/jmc_solo_icono.png" alt="JMC" className="h-10 w-auto" />
          </a>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-jmc-morado hover:bg-white/20" aria-label="Abrir menú">
              <SidebarIcon name="sidebar_icon" />Menú
            </button>
          </Dialog.Trigger>
        </header>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-jmc-noche/50 backdrop-blur-sm" />
          <Dialog.Content aria-describedby={undefined} className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-gradient-to-b from-[#c6a0d9] to-[#dc9bc9] p-6 shadow-2xl">
            <Dialog.Title className="sr-only">Menú de navegación</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Cerrar menú" className="mb-5 self-end rounded-full p-2 text-jmc-morado hover:bg-white/25"><X aria-hidden="true" /></button>
            </Dialog.Close>
            <SidebarLinks onNavigate={() => setAbierto(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
