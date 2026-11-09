import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SITIO } from '@/data/site'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const LEMAS = ['Fe', 'Amistad', 'Servicio']

export function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-svh items-center overflow-hidden">

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-28 pt-28 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-jmc-morado/15 bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur sm:text-sm"
          >
            <span className="size-1.5 rounded-full bg-jmc-rosa" aria-hidden="true" />
            {SITIO.parroquia} · {SITIO.ciudad}
          </motion.p>

          <motion.h1 variants={item} className="text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
            Jóvenes
            <br />
            <span className="text-jmc-morado">Misioneros</span>
            <br />
            para Cristo
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-jmc-noche/80 sm:text-xl">
            Una comunidad de jóvenes que camina junta: retiros, peregrinaciones, paseos y servicio, siempre de la mano del Señor de la Misericordia.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="hover:-translate-y-0.5">
              <a href="#unete">Quiero unirme</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-jmc-morado/30 text-jmc-morado bg-transparent hover:-translate-y-0.5 hover:bg-jmc-morado/5">
              <a href="#actividades">Ver actividades</a>
            </Button>
          </motion.div>

          <motion.ul variants={item} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-jmc-morado">
            {LEMAS.map((lema, i) => (
              <li key={lema} className="flex items-center gap-6">
                {lema}
                {i < LEMAS.length - 1 && <span className="size-1 rounded-full bg-jmc-morado/30" aria-hidden="true" />}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.9, ease: 'easeOut' }}
          className="relative flex items-center justify-center"
        >
          <img
            src="/logos/jmc_solo_icono.png"
            alt="Escudo de JMC: torre con cruz, corona de espinas y tres jóvenes tomados de la mano"
            className="animate-float relative size-60 object-contain  sm:size-72 lg:size-80"
          />
        </motion.div>
      </div>

      <a
        href="#nosotros"
        aria-label="Bajar a la siguiente sección"
        className="absolute inset-x-0 bottom-6 mx-auto w-fit animate-bounce rounded-full p-2 text-jmc-morado focus-visible:outline-2 focus-visible:outline-jmc-morado"
      >
        <ChevronDown className="size-8" />
      </a>
    </section>
  )
}
