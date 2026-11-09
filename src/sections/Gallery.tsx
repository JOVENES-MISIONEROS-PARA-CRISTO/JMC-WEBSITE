import { Camera } from 'lucide-react'
import { useEffect, useState } from 'react'
import { galeriaStorage } from '@/lib/supabase'
import { Reveal, SectionTitle } from '@/components/Reveal'
import { GALERIA } from '@/data/site'
import { cn } from '@/lib/utils'

const FONDOS = [
  'from-jmc-morado to-jmc-magenta',
  'from-jmc-magenta to-jmc-rosa',
  'from-jmc-rosa to-jmc-morado',
]

export function Gallery() {
  const [urls, setUrls] = useState<Record<string, string>>({})
  useEffect(() => {
    const bucket = galeriaStorage
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
  }, [])
  const fotos = GALERIA.map(f => ({ ...f, src: urls[f.id] ?? f.src }))
  return (
    <section id="galeria" className="bg-jmc-soft-reverse px-5 py-24 text-jmc-noche">
      <div className="mx-auto max-w-6xl">
        <SectionTitle kicker="Recuerdos" title="Galería" subtitle="Momentos que nos han marcado en el camino." />
        <div className="grid auto-rows-[10rem] grid-cols-2 gap-4 md:grid-cols-3 md:auto-rows-[13rem]">
          {fotos.map((f, i) => (
            <Reveal key={f.titulo} delay={(i % 3) * 0.08} className={cn(f.alto === 'alto' && 'row-span-2')}>
              <figure
                className={cn(
                  'group relative size-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br',
                  FONDOS[i % FONDOS.length],
                )}
              >
                {f.src ? (
                  <img src={f.src} alt={f.titulo} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex size-full items-center justify-center text-white/30">
                    <Camera className="size-12" />
                  </div>
                )}
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 font-semibold text-white">
                  {f.titulo}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
