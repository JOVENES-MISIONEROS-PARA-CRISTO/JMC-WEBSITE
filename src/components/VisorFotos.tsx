import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, ArrowRight, Download, X } from 'lucide-react'
import { useRef, useState } from 'react'
import type { galeriaStorage } from '@/lib/supabase'

type Props = {
  bucket: typeof galeriaStorage
  carpeta: string
  nombres: string[]
  titulo: string
}

export function VisorFotos({ bucket, carpeta, nombres, titulo }: Props) {
  const [indice, setIndice] = useState<number | null>(null)
  const [descargando, setDescargando] = useState(false)
  const [error, setError] = useState('')
  const origen = useRef<HTMLButtonElement | null>(null)
  const actual = indice ?? 0
  const url = (nombre: string) => bucket?.getPublicUrl(`${carpeta}/${nombre}`).data.publicUrl
  const avanzar = (paso: number) => {
    setIndice(valor => ((valor ?? 0) + paso + nombres.length) % nombres.length)
    setError('')
  }

  async function descargar() {
    if (!bucket || indice === null || descargando) return
    const seleccion = indice
    setDescargando(true)
    setError('')
    try {
      const { data, error: fallo } = await bucket.download(`${carpeta}/${nombres[seleccion]}`)
      if (fallo || !data) throw fallo
      let jpg = data
      if (data.type !== 'image/jpeg') {
        const imagen = new Image()
        const fuente = URL.createObjectURL(data)
        try {
          imagen.src = fuente
          await imagen.decode()
          const lienzo = document.createElement('canvas')
          lienzo.width = imagen.naturalWidth
          lienzo.height = imagen.naturalHeight
          const contexto = lienzo.getContext('2d')
          if (!contexto) throw new Error('No se pudo convertir la foto.')
          contexto.fillStyle = '#ffffff'
          contexto.fillRect(0, 0, lienzo.width, lienzo.height)
          contexto.drawImage(imagen, 0, 0)
          jpg = await new Promise<Blob>((resolve, reject) => {
            lienzo.toBlob(resultado => {
              if (resultado?.type === 'image/jpeg') resolve(resultado)
              else reject(new Error('No se pudo crear el JPG.'))
            }, 'image/jpeg', 0.95)
          })
        } finally {
          URL.revokeObjectURL(fuente)
        }
      }
      const enlace = document.createElement('a')
      const objeto = URL.createObjectURL(jpg)
      enlace.href = objeto
      enlace.download = `${titulo}-${seleccion + 1}.jpg`
      document.body.appendChild(enlace)
      enlace.click()
      enlace.remove()
      window.setTimeout(() => URL.revokeObjectURL(objeto), 60000)
    } catch {
      setError('No se pudo descargar la foto. Inténtalo de nuevo.')
    } finally {
      setDescargando(false)
    }
  }

  return <Dialog.Root open={indice !== null} onOpenChange={abierto => {
    if (!abierto) { setIndice(null); setError('') }
  }}>
    <div className="grid gap-4 sm:grid-cols-2">
      {nombres.map((nombre, i) => (
        <button key={nombre} type="button" className="cursor-zoom-in rounded-xl focus-visible:outline-2 focus-visible:outline-jmc-morado" aria-label={`Ampliar ${titulo}, foto ${i + 1}`} onClick={event => {
          origen.current = event.currentTarget
          setIndice(i)
          setError('')
        }}>
          <img className="w-full rounded-xl" loading="lazy" alt={`${titulo}, foto ${i + 1}`} src={url(nombre)} />
        </button>
      ))}
    </div>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[110] bg-black/80" />
      <Dialog.Content aria-describedby={undefined}
        onCloseAutoFocus={event => { event.preventDefault(); origen.current?.focus({ preventScroll: true }) }}
        onKeyDown={event => {
          if (event.key === 'ArrowLeft') { event.preventDefault(); avanzar(-1) }
          if (event.key === 'ArrowRight') { event.preventDefault(); avanzar(1) }
        }}
        className="photo-viewer text-jmc-noche">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <Dialog.Title className="min-w-0 break-words text-sm font-bold sm:text-base">{titulo}</Dialog.Title>
          <Dialog.Close aria-label="Cerrar foto" className="flex size-11 shrink-0 items-center justify-center rounded-lg border"><X size={22} /></Dialog.Close>
        </div>
        <img key={nombres[actual]} src={url(nombres[actual])} alt={`${titulo}, foto ${actual + 1}`} className="min-h-0 w-full flex-1 object-contain" />
        <div className="photo-viewer-controls">
          <button type="button" disabled={nombres.length < 2} onClick={() => avanzar(-1)} aria-label="Foto anterior" className="rounded-lg border p-3 disabled:opacity-40"><ArrowLeft size={22} /></button>
          <span aria-live="polite">{actual + 1} / {nombres.length}</span>
          <button type="button" disabled={nombres.length < 2} onClick={() => avanzar(1)} aria-label="Foto siguiente" className="rounded-lg border p-3 disabled:opacity-40"><ArrowRight size={22} /></button>
          <button type="button" onClick={descargar} disabled={descargando} className="photo-download flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 disabled:opacity-50"><Download size={20} />{descargando ? 'Descargando…' : 'Descargar'}</button>
        </div>
        {error && <p role="status">{error}</p>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
