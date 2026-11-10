import { VisorFotos } from './VisorFotos'
import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'
import type { galeriaStorage } from '@/lib/supabase'

import type { FotoGaleria } from '@/data/site'
import { carpetaCategoria, tituloAlbum } from '@/lib/albumes'

type Bucket = typeof galeriaStorage

function Contenido({ categoria, bucket, mes, elegir }: { categoria: FotoGaleria; bucket: Bucket; mes: string; elegir: (mes: string) => void }) {
  const [nombres, setNombres] = useState<string[]>([])
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>('cargando')
  const base = carpetaCategoria(categoria)
  const carpeta = mes ? `${base}/${mes}` : base
  useEffect(() => {
    let activo = true
    async function cargar() {
      if (!bucket) { setEstado('error'); return }
      const elementos: string[] = []
      for (let offset = 0; activo; offset += 100) {
        const { data, error } = await bucket.list(carpeta, { limit: 100, offset, sortBy: { column: 'name', order: mes ? 'asc' : 'desc' } })
        if (error) throw error
        elementos.push(...data.filter(f => mes ? Boolean(f.id) && !f.name.startsWith('.') : /^\d{4}-(0[1-9]|1[0-2])$/.test(f.name)).map(f => f.name))
        if (data.length < 100) break
      }
      if (activo) { setNombres(elementos); setEstado('listo') }
    }
    cargar().catch(() => { if (activo) setEstado('error') })
    return () => { activo = false }
  }, [bucket, carpeta, mes])

  if (estado === 'cargando') return <p role="status">Cargando…</p>
  if (estado === 'error') return <p role="status">No se pudo cargar la galería. Vuelve a abrirla para intentarlo de nuevo.</p>
  if (!nombres.length) return <p>{mes ? 'Este álbum aún no tiene fotos.' : 'Aún no hay álbumes publicados en esta categoría.'}</p>
  if (mes) return <VisorFotos bucket={bucket} carpeta={carpeta} nombres={nombres} titulo={tituloAlbum(categoria, mes)} />
  return <div className="grid gap-4 sm:grid-cols-2">{nombres.map(nombre => (
    <button key={nombre} className="rounded-xl border p-4 text-left font-semibold" onClick={() => elegir(nombre)}>{tituloAlbum(categoria, nombre)}</button>
  ))}</div>
}

export function AlbumesCategoria({ bucket, categoria }: { bucket: Bucket; categoria: FotoGaleria }) {
  const [mes, setMes] = useState('')
  return <Dialog.Root onOpenChange={abierto => { if (!abierto) setMes('') }}>
    <Dialog.Trigger className="absolute inset-0 cursor-pointer rounded-3xl focus-visible:ring-4 focus-visible:ring-inset" aria-label={`Ver álbumes de ${categoria.titulo}`} />
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/70" />
      <Dialog.Content aria-describedby={undefined} className="album-dialog text-jmc-noche">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Dialog.Title className="min-w-0 break-words text-xl font-bold sm:text-2xl">{mes ? tituloAlbum(categoria, mes) : categoria.titulo}</Dialog.Title>
          <Dialog.Close className="min-h-11 shrink-0 rounded-lg border px-3 py-2">Cerrar</Dialog.Close>
        </div>
        {mes && <button className="mb-4 min-h-11 underline" onClick={() => setMes('')}>Volver a los álbumes</button>}
        <Contenido categoria={categoria} key={mes} mes={mes} elegir={setMes} bucket={bucket} />
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
