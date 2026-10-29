import { CalendarDays, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Reveal, SectionTitle } from '@/components/Reveal'
import { CATEGORIAS, EVENTOS_EJEMPLO } from '@/data/site'
import { supabase, type Evento } from '@/lib/supabase'

function formatearFecha(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function Events() {
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_EJEMPLO)
  const [ejemplo, setEjemplo] = useState(true)

  useEffect(() => {
    if (!supabase) return
    const hoy = new Date().toISOString().slice(0, 10)
    supabase
      .from('eventos')
      .select('*')
      .gte('fecha', hoy)
      .order('fecha', { ascending: true })
      .limit(9)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setEventos(data as Evento[])
          setEjemplo(false)
        }
      })
  }, [])

  return (
    <section id="eventos" className="bg-jmc-soft px-5 py-24 text-jmc-noche">
      <div className="mx-auto max-w-6xl">
        <SectionTitle kicker="Calendario" title="Próximos eventos" subtitle="Apunta las fechas y no te pierdas ninguna." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((e, i) => (
            <Reveal key={e.id} delay={(i % 3) * 0.1}>
              <Card className="h-full border-white/35 bg-white/30 shadow-sm backdrop-blur-md">
                <CardContent>
                  <Badge className="bg-jmc-rosa/10 text-jmc-magenta">{CATEGORIAS[e.categoria]}</Badge>
                  <h3 className="mt-4 text-xl font-bold">{e.titulo}</h3>
                  {e.descripcion && <p className="mt-2 text-jmc-noche/70">{e.descripcion}</p>}
                  <p className="mt-4 flex items-center gap-2 text-sm text-jmc-noche/80 first-letter:uppercase">
                    <CalendarDays className="size-4 shrink-0 text-jmc-rosa" />
                    {formatearFecha(e.fecha)}
                  </p>
                  {e.lugar && (
                    <p className="mt-1.5 flex items-center gap-2 text-sm text-jmc-noche/80">
                      <MapPin className="size-4 shrink-0 text-jmc-rosa" />
                      {e.lugar}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
        {ejemplo && (
          <p className="mt-8 text-center text-sm text-jmc-noche/60">Eventos de ejemplo — se reemplazan con los del panel de administración.</p>
        )}
      </div>
    </section>
  )
}
