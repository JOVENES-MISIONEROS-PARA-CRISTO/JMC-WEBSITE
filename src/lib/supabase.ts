import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** `true` cuando las variables de entorno de Supabase están configuradas. */
export const supabaseListo = Boolean(url && anonKey)

export const supabase = supabaseListo ? createClient(url!, anonKey!) : null

export type Evento = {
  id: string
  titulo: string
  descripcion: string | null
  categoria: 'retiro' | 'paseo' | 'peregrinacion' | 'reunion' | 'servicio' | 'otro'
  fecha: string // ISO date
  lugar: string | null
  publicado: boolean
}

export type Solicitud = {
  id: string
  nombre: string
  edad: number | null
  telefono: string
  mensaje: string | null
  created_at: string
}
