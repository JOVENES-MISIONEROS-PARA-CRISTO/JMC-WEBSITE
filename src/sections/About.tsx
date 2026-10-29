import { Heart, Users, Flame } from 'lucide-react'


import { Card, CardContent } from '@/components/ui/card'
import { Reveal, SectionTitle } from '@/components/Reveal'
import { PILARES, SITIO } from '@/data/site'

const ICONOS = [Flame, Users, Heart]

export function About() {
  return (
    <section id="nosotros" className="bg-jmc-soft px-5 py-24 text-jmc-noche">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          kicker="Quiénes somos"
          title="Un grupo de jóvenes con una misión"
          subtitle="JMC nace dentro de la Parroquia del Señor de la Misericordia, en Ocotlán, para que los jóvenes encuentren un lugar donde crecer en la fe y en la amistad."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {PILARES.map((p, i) => {
            const Icono = ICONOS[i]
            return (
              <Reveal key={p.titulo} delay={i * 0.1}>
                <Card className="h-full border-white/35 bg-white/30 shadow-sm backdrop-blur-md">
                  <CardContent className="p-8">
                    <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-jmc-gradient text-white">
                      <Icono className="size-7" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold">{p.titulo}</h3>
                    <p className="text-jmc-noche/70">{p.texto}</p>
                  </CardContent>
                </Card>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-16">
          <div className="rounded-3xl border border-white/35 bg-white/40 p-8 backdrop-blur-md text-jmc-noche md:p-10">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_auto]">
              <div>
                <h3 className="text-2xl font-bold text-jmc-morado">Somos parte de la parroquia</h3>
                <p className="mt-2 text-jmc-noche/75">
                  Caminamos junto al Prodigioso Señor de la Misericordia de Ocotlán y junto a los demás grupos de nuestra parroquia.
                </p>
                <a href={SITIO.sitioParroquia} target="_blank" rel="noreferrer" className="mt-4 inline-block font-semibold text-jmc-magenta underline-offset-4 hover:underline">
                  Conoce el sitio de la parroquia →
                </a>
              </div>
              <img src="/logos/logo%20nuevo%20srdlm.png" alt="Logo del Señor de la Misericordia, Parroquia de Ocotlán" className="h-28 w-auto" />
              <div className="flex h-28 items-center rounded-2xl bg-jmc-noche px-4">
                <img src="/logos/EAS%20BLANCO.png" alt="Logo Ea's, Señor de la Misericordia Ocotlán" className="h-20 w-auto" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
