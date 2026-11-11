import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Images, FolderOpen, CalendarDays, Users, ExternalLink, LogOut, Layers, ArrowUpRight, Sparkles, UserRound } from 'lucide-react'
import { GALERIA } from '@/data/site'
import { galeriaStorage, supabase } from '@/lib/supabase'
import { carpetaCategoria, tituloAlbum } from '@/lib/albumes'

type Album = { titulo: string; mes: string; fotos: number; imagen: string }
const links = [ ['admin-resumen', 'Resumen', LayoutDashboard], ['admin-albumes', 'Fotografías', Images], ['admin-eventos', 'Eventos', CalendarDays], ['admin-solicitudes', 'Solicitudes', Users] ] as const
export function AdminDashboard({ children, email, eventos, solicitudes }: { children: ReactNode; email: string; eventos: number; solicitudes: number }) {
  const [activo, setActivo] = useState('admin-resumen')
  const [albumes, setAlbumes] = useState<Album[]>([])
  const [estado, setEstado] = useState('Cargando álbumes…')
  useEffect(() => {
    let mounted = true
    async function cargar() {
      const bucket = galeriaStorage
      if (!bucket) { setEstado('La galería no está disponible.'); return }
      async function listar(path: string) {
        const files = []
        for (let offset = 0; ; offset += 100) {
          const { data, error } = await bucket!.list(path, { limit: 100, offset })
          if (error) throw error
          files.push(...data)
          if (data.length < 100) return files
        }
      }
      try {
        const grupos = await Promise.all(GALERIA.map(async categoria => {
          const base = carpetaCategoria(categoria)
          const meses = (await listar(base)).filter(f => /^\d{4}-(0[1-9]|1[0-2])$/.test(f.name))
          return Promise.all(meses.map(async mes => {
            const fotos = (await listar(`${base}/${mes.name}`)).filter(f => f.id && !f.name.startsWith('.'))
            return { titulo: tituloAlbum(categoria, mes.name), mes: mes.name, fotos: fotos.length, imagen: fotos[0] ? bucket.getPublicUrl(`${base}/${mes.name}/${fotos[0].name}`).data.publicUrl : '' }
          }))
        }))
        if (mounted) { setAlbumes(grupos.flat().sort((a,b) => b.mes.localeCompare(a.mes))); setEstado('') }
      } catch { if (mounted) setEstado('No se pudieron cargar los álbumes. Recarga la página para intentarlo de nuevo.') }
    }
    void cargar()
    window.addEventListener('admin-albumes-updated', cargar)
    return () => { mounted = false; window.removeEventListener('admin-albumes-updated', cargar) }
  }, [])
  return <div className="admin-app">
    <aside className="admin-sidebar">
      <Link to="/" className="admin-brand"><img src="/logos/jmc_solo_icono.png" alt="JMC" /><strong>JMC Admin</strong><span>Jóvenes Misioneros<br />para Cristo</span></Link>
      <nav aria-label="Administración">{links.map(([id, title, Icon]) => <a key={id} href={`#${id}`} onClick={() => setActivo(id)} className={activo === id ? 'active' : ''}><Icon size={22} />{title}</a>)}</nav>
      <div className="admin-sidebar-bottom"><Link to="/"><ExternalLink size={19} />Ver sitio web</Link><button onClick={() => void supabase?.auth.signOut()}><LogOut size={19} />Cerrar sesión</button></div>
    </aside>
    <div className="admin-workspace"><header className="admin-header"><div><h1>¡Hola, JMC!</h1><p>Gestiona la galería y el contenido del sitio.</p></div><div className="admin-account"><UserRound /><span>{email}</span></div></header>
    <main className="admin-main"><section id="admin-resumen"><div className="admin-section-title"><div><span className="admin-eyebrow">TU COMUNIDAD, EN UN SOLO LUGAR</span><h2>Resumen general</h2><p>Un vistazo al contenido que compartimos.</p></div><Sparkles /></div>
    <div className="admin-stats">{[[FolderOpen, estado ? '—' : albumes.length, 'Álbumes'], [Images, estado ? '—' : albumes.reduce((n,a) => n+a.fotos,0), 'Fotografías en álbumes'], [Layers, GALERIA.length, 'Categorías']].map(([Icon, value, label]) => { const Symbol = Icon as typeof Images; return <div className="admin-stat" key={String(label)}><span className="admin-stat-icon"><Symbol /></span><div><strong>{String(value)}</strong><p>{String(label)}</p></div></div> })}</div>
    <div className="admin-overview"><div className="admin-welcome"><span className="admin-eyebrow">CADA FOTO CUENTA UNA HISTORIA</span><h2>Comparte lo que<br />vivimos juntos.</h2><p>Agrega fotografías a nuestros álbumes y mantén viva la memoria de la comunidad.</p><a href="#admin-albumes">Publicar fotografías <ArrowUpRight size={20} /></a><div className="admin-mini-stats">{eventos} eventos · {solicitudes} solicitudes para unirse</div></div>
    <div className="admin-recent"><div className="admin-recent-title"><h3><FolderOpen />Álbumes recientes</h3><a href="#admin-albumes">Subir fotos <ArrowUpRight size={16} /></a></div>{estado ? <p role="status">{estado}</p> : albumes.length ? albumes.slice(0,3).map(a => <div className="admin-album" key={a.titulo}>{a.imagen ? <img src={a.imagen} alt="" /> : <FolderOpen />}<div><strong>{a.titulo}</strong><p>{a.mes} · {a.fotos} fotos</p></div></div>) : <p>Aún no hay álbumes. Publica tus primeras fotografías para comenzar.</p>}</div></div>
    <div className="admin-shortcuts"><strong>Accesos rápidos</strong><a href="#admin-albumes"><FolderOpen />Subir fotos</a><a href="#admin-eventos"><CalendarDays />Crear evento</a></div>
    </section>{children}</main></div>
  </div>
}
