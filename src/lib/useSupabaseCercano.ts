import { useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export function useSupabaseCercano() {
  const seccion = useRef<HTMLElement>(null)
  const cerca = useInView(seccion, { once: true, margin: '500px 0px' })
  const [servicios, setServicios] = useState<typeof import('./supabase')>()

  useEffect(() => {
    if (!cerca) return
    let activo = true
    import('./supabase').then(modulo => {
      if (activo) setServicios(modulo)
    }).catch(error => console.error('No se pudo cargar Supabase.', error))
    return () => { activo = false }
  }, [cerca])

  return { seccion, servicios }
}
