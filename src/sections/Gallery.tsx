import { AlbumesCategoria } from '@/components/AlbumesCategoria'
import { ArrowRight, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useSupabaseCercano } from '@/lib/useSupabaseCercano'
import { SectionTitle } from '@/components/Reveal'
import { GALERIA } from '@/data/site'
import { cn } from '@/lib/utils'

const FONDOS = [
  'from-jmc-morado to-jmc-magenta',
  'from-jmc-magenta to-jmc-rosa',
  'from-jmc-rosa to-jmc-morado',
]

export function Gallery() {
  const [proporciones, setProporciones] = useState<Record<string, number>>({})
  const [porPagina, setPorPagina] = useState(() =>
    typeof window === 'undefined' ? 3 : window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3,
  )
  const carrusel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const movil = window.matchMedia('(max-width: 639px)')
    const tablet = window.matchMedia('(max-width: 1023px)')
    const actualizar = () => setPorPagina(movil.matches ? 1 : tablet.matches ? 2 : 3)
    actualizar()
    movil.addEventListener('change', actualizar)
    tablet.addEventListener('change', actualizar)
    return () => {
      movil.removeEventListener('change', actualizar)
      tablet.removeEventListener('change', actualizar)
    }
  }, [])
  useEffect(() => {
    if (carrusel.current) carrusel.current.scrollLeft = 0
  }, [porPagina])
  const [posicion, setPosicion] = useState({ inicio: true, final: false })
  const { seccion, servicios } = useSupabaseCercano()
  const bucket = servicios?.galeriaStorage
  const [urls, setUrls] = useState<Record<string, string>>({})
  useEffect(() => {
    if (!bucket) return
    let activo = true
    void bucket.list().then(({ data, error }) => {
      if (!activo || error || !data) return
      setUrls(Object.fromEntries(data.map(foto => [
        foto.name,
        bucket.getPublicUrl(foto.name).data.publicUrl + '?v=' + encodeURIComponent(foto.updated_at ?? ''),
      ])))
    })
    return () => { activo = false }
  }, [bucket])
  const fotos = GALERIA.map(f => ({ ...f, src: urls[f.id] ?? f.src }))
  function actualizarPosicion() {
    const el = carrusel.current
    if (el) setPosicion({ inicio: el.scrollLeft < 2, final: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 })
  }
  useEffect(() => {
    const el = carrusel.current
    if (!el) return
    const observer = new ResizeObserver(actualizarPosicion)
    observer.observe(el)
    actualizarPosicion()
    return () => observer.disconnect()
  }, [proporciones, porPagina])
  function desplazar(direccion: number) {
    const el = carrusel.current
    if (el) el.scrollBy({ left: direccion * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  function renderFoto(f: typeof fotos[number], i: number) {
    return (
<figure key={f.id} className="gallery-item min-w-0" style={{ '--photo-ratio': proporciones[f.src ?? f.id] ?? 1.5 } as CSSProperties}>
                <div className={cn('gallery-image group relative flex aspect-[4/3] items-center justify-center', !f.src && ['overflow-hidden rounded-3xl bg-gradient-to-br', FONDOS[i % FONDOS.length]])}>
                  {f.src ? (
                    <img src={f.src} alt={f.titulo} loading="lazy" onLoad={event => {
                      const img = event.currentTarget
                      if (img.naturalHeight) setProporciones(actual => ({ ...actual, [f.src!]: img.naturalWidth / img.naturalHeight }))
                    }} className="block h-auto w-auto max-h-full max-w-full rounded-3xl object-contain" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-white/60"><Camera className="size-12" aria-hidden="true" /></div>
                  )}
                  <AlbumesCategoria categoria={f} bucket={bucket} />
                </div>
                <figcaption className="mt-4 font-semibold">{f.titulo}</figcaption>
              </figure>
    )
  }
  return (
    <section ref={seccion} id="galeria" className="bg-jmc-soft-reverse px-5 py-24 text-jmc-noche">
      <div className="mx-auto section-layout gallery-layout">
        <SectionTitle centered kicker="Nuestros recuerdos" title="Galería" subtitle="Momentos que nos han marcado en el camino." />
        <div className="gallery-heading flex items-center justify-between gap-4">
          <h3 className="font-semibold">Momentos destacados</h3>
          {fotos.length > porPagina && <span className="flex items-center gap-2 text-sm text-jmc-noche/70">Desliza para explorar <ArrowRight className="size-4" aria-hidden="true" /></span>}
        </div>
        <div className="gallery-stage relative">
          <div id="gallery-photos" ref={carrusel} onScroll={actualizarPosicion} className="gallery-carousel scrollbar-none" role="region" aria-label="Fotos de la galería" tabIndex={0}>
            {Array.from({ length: Math.ceil(fotos.length / porPagina) }, (_, pagina) => (
              <div className="gallery-page" key={pagina} role="group" aria-label={`Grupo ${pagina + 1}`} style={{
                '--page-ratio': fotos.slice(pagina * porPagina, (pagina + 1) * porPagina).reduce((total, f) => total + (proporciones[f.src ?? f.id] ?? 1.5), 0),
                '--page-gaps': Math.min(porPagina - 1, fotos.length - pagina * porPagina - 1),
              } as CSSProperties}>
                {fotos.slice(pagina * porPagina, (pagina + 1) * porPagina).map((f, i) => renderFoto(f, pagina * porPagina + i))}
          {fotos.length > porPagina && <>
            <button type="button" className="gallery-arrow gallery-arrow-prev" aria-controls="gallery-photos" aria-label="Ver fotos anteriores" disabled={posicion.inicio} onClick={() => desplazar(-1)}><ChevronLeft aria-hidden="true" /></button>
            <button type="button" className="gallery-arrow gallery-arrow-next" aria-controls="gallery-photos" aria-label="Ver siguientes fotos" disabled={posicion.final} onClick={() => desplazar(1)}><ChevronRight aria-hidden="true" /></button>
          </>}
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
