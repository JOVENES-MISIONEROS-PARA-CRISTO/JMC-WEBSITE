import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-jmc-morado">{kicker}</p>
      <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-current/70">{subtitle}</p>}
    </Reveal>
  )
}
