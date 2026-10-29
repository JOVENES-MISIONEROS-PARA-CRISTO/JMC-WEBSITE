import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SITIO } from '@/data/site'

export function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-svh items-center overflow-hidden bg-jmc-gradient">
      <div className="pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full bg-jmc-rosa/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-[28rem] rounded-full bg-jmc-morado/60 blur-3xl" />
      <div className="jmc-hero-fade pointer-events-none absolute inset-x-0 bottom-0 h-48 sm:h-64" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-24 pt-28 md:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur"
          >
            {SITIO.parroquia} · {SITIO.ciudad}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            Jóvenes
            <br />
            <span className="text-jmc-gradient">Misioneros</span>
            <br />
            para Cristo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-6 max-w-lg text-lg text-white/85"
          >
            Una comunidad de jóvenes que camina junta: retiros, peregrinaciones, paseos y servicio, siempre de la mano del Señor de la Misericordia.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild variant="light" size="lg">
              <a href="#unete">Quiero unirme</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#actividades">Ver actividades</a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex justify-center"
        >
          <img
            src="/logos/jmc_solo_icono.png"
            alt="Escudo de JMC: torre con cruz, corona de espinas y tres jóvenes tomados de la mano"
            className="size-64 object-contain animate-float drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)] sm:size-80 lg:size-96"
          />
        </motion.div>
      </div>

      <a href="#nosotros" aria-label="Bajar" className="absolute inset-x-0 bottom-6 mx-auto w-fit animate-bounce text-jmc-morado">
        <ChevronDown className="size-8" />
      </a>
    </section>
  )
}
