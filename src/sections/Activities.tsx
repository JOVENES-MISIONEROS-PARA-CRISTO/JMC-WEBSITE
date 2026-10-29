import { Church, Mountain, Route, HandHeart, PartyPopper, Sparkles, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Reveal, SectionTitle } from '@/components/Reveal'
import { ACTIVIDADES, type Actividad } from '@/data/site'

const ICONOS: Record<Actividad['icono'], LucideIcon> = {
  cruz: Church,
  montana: Mountain,
  camino: Route,
  manos: HandHeart,
  musica: PartyPopper,
  estrella: Sparkles,
}

export function Activities() {
  return (
    <section id="actividades" className="relative bg-jmc-soft-reverse px-5 py-24 text-jmc-noche">
      <div className="mx-auto max-w-6xl">
        <SectionTitle kicker="Qué hacemos" title="Actividades del grupo" subtitle="Fe, aventura y convivencia: así vivimos el año en JMC." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVIDADES.map((a, i) => {
            const Icono = ICONOS[a.icono]
            return (
              <Reveal key={a.titulo} delay={(i % 3) * 0.1}>
                <Card className="group h-full border-white/35 bg-white/30 shadow-sm backdrop-blur-md">
                  <CardContent className="p-7">
                    <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-jmc-rosa/10 text-jmc-magenta transition group-hover:bg-jmc-gradient group-hover:text-white">
                      <Icono className="size-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{a.titulo}</h3>
                    <p className="text-jmc-noche/70">{a.texto}</p>
                  </CardContent>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
