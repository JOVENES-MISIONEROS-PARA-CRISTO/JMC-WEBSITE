import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { prepararFoto } from '@/lib/prepararFoto'
import { galeriaStorage } from '@/lib/supabase'
import { carpetaCategoria, tituloAlbum } from '@/lib/albumes'
import { GALERIA } from '@/data/site'
import { Input, Label } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function ImagenAmpliada({ foto }: { foto: File }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState(false)
  useEffect(() => {
    const objeto = URL.createObjectURL(foto)
    setUrl(objeto)
    return () => URL.revokeObjectURL(objeto)
  }, [foto])

  return <div className="grid h-[min(70dvh,calc(100dvh-11rem))] place-items-center rounded-lg bg-black/30">
    {error && <p>No se pudo mostrar la foto.</p>}
    {url && !error && <img src={url} alt={foto.name} onError={() => setError(true)} className="h-full min-h-0 w-full object-contain" />}
  </div>
}

function VisorSeleccion({ fotos, inicial }: { fotos: File[]; inicial: number }) {
  const [indice, setIndice] = useState(inicial)
  const foto = fotos[indice]
  const mover = (paso: number) => setIndice(actual => (actual + paso + fotos.length) % fotos.length)

  return <Dialog.Content aria-describedby={undefined}
    onKeyDown={evento => {
      if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return
      evento.preventDefault()
      mover(evento.key === 'ArrowLeft' ? -1 : 1)
    }}
    className="fixed top-1/2 left-1/2 z-[101] w-[94vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-jmc-noche p-4 text-white">
    <div className="mb-3 flex items-center justify-between gap-3">
      <Dialog.Title className="truncate font-semibold">{foto.name}</Dialog.Title>
      <Dialog.Close type="button" className="min-h-11 shrink-0 rounded-lg border border-white/30 px-4">Cerrar</Dialog.Close>
    </div>
    <ImagenAmpliada key={indice} foto={foto} />
    {fotos.length > 1 && <div className="mt-3 flex items-center justify-center gap-5">
      <button type="button" aria-label="Foto anterior" onClick={() => mover(-1)} className="grid size-11 place-items-center rounded-full border border-white/30"><ChevronLeft /></button>
      <span role="status">Foto {indice + 1} de {fotos.length}</span>
      <button type="button" aria-label="Foto siguiente" onClick={() => mover(1)} className="grid size-11 place-items-center rounded-full border border-white/30"><ChevronRight /></button>
    </div>}
  </Dialog.Content>
}

function VistaPrevia({ fotos, indice }: { fotos: File[]; indice: number }) {
  const foto = fotos[indice]
  const [url, setUrl] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const preview = URL.createObjectURL(foto)
    setUrl(preview)
    setError(false)
    return () => URL.revokeObjectURL(preview)
  }, [foto])

  return <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-black/20">
    {error ? <p className="p-3 text-center text-xs text-white/65">No se pudo mostrar la vista previa.</p> : url ? <Dialog.Root>
      <Dialog.Trigger type="button" aria-label={`Ampliar ${foto.name}`} className="relative h-full w-full cursor-zoom-in rounded-lg focus-visible:outline-2 focus-visible:-outline-offset-2">
        <img src={url} alt="" className="h-full w-full object-contain" loading="lazy" onError={() => setError(true)} />
        <span className="absolute right-2 bottom-2 rounded-md bg-black/70 p-1.5 text-white"><Maximize2 size={16} aria-hidden="true" /></span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80" />
        <VisorSeleccion fotos={fotos} inicial={indice} />
      </Dialog.Portal>
    </Dialog.Root> : null}
  </div>
}

export function AdminAlbumes() {
  const [ocupado, setOcupado] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [fotos, setFotos] = useState<File[]>([])
  async function publicar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!galeriaStorage || ocupado) return
    const form = event.currentTarget
    const datos = new FormData(form)
    const categoria = GALERIA.find(f => f.id === datos.get('categoria'))
    if (!categoria) {
      setMensaje('Selecciona una categoría de la galería.')
      return
    }
    const mes = String(datos.get('mes'))
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mes) || !fotos.length || fotos.some(f => !f.size || f.size > 20 * 1024 * 1024 || !['image/jpeg','image/png','image/webp'].includes(f.type))) {
      setMensaje('Selecciona un mes y fotos JPG, PNG o WebP de hasta 20 MB cada una.')
      return
    }
    setOcupado(true)
    let publicadas = 0
    try {
      for (const foto of fotos) {
        setMensaje(`Publicando foto ${publicadas + 1} de ${fotos.length}…`)
        const hash = await crypto.subtle.digest('SHA-256', await foto.arrayBuffer())
        const nombre = Array.from(new Uint8Array(hash), n => n.toString(16).padStart(2, '0')).join('')
        const imagen = await prepararFoto(foto)
        const { error } = await galeriaStorage.upload(`${carpetaCategoria(categoria)}/${mes}/${nombre}`, imagen, { upsert: true, contentType: imagen.type })
        if (error) throw error
        publicadas++
      }
      setMensaje(`${tituloAlbum(categoria, mes)} · Fotos publicadas: ${publicadas}.`)
      form.reset()
      setFotos([])

    } catch {
      setMensaje(`Se publicaron ${publicadas} de ${fotos.length} fotos. Puedes reintentar con la misma selección.`)
    } finally {
      if (publicadas) window.dispatchEvent(new Event("admin-albumes-updated"))
      setOcupado(false)
    }
  }
  return <form id="admin-albumes" onSubmit={publicar} className="jmc-glass-card mt-6 grid gap-4 rounded-2xl border border-white/10 p-5">
    <h3 className="text-xl font-bold">Publicar fotografías</h3>
    <p>Elige la categoría y el mes. Si el álbum ya existe, las fotos se agregarán a él.</p>
    <div>
      <Label htmlFor="categoria-album">Categoría del álbum</Label>
      <select id="categoria-album" name="categoria" required disabled={ocupado} className="w-full rounded-2xl bg-jmc-noche p-3">
        {GALERIA.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
      </select>
    </div>
    <div><Label htmlFor="mes-album">Mes y año</Label><Input id="mes-album" name="mes" type="month" required disabled={ocupado} /></div>
    <div>
      <Label htmlFor="fotos-album">Seleccionar fotografías</Label>
      <p id="fotos-ayuda" className="mb-3 text-sm text-white/65">Puedes elegir varias a la vez o agregar más después. JPG, PNG o WebP · Máximo 20 MB por foto.</p>
      <Input id="fotos-album" name="fotos" type="file" multiple disabled={ocupado} accept="image/jpeg,image/png,image/webp" aria-describedby="fotos-ayuda" onChange={event => {
        const nuevas = Array.from(event.currentTarget.files ?? [])
        const validas = nuevas.filter(f => f.size > 0 && f.size <= 20 * 1024 * 1024 && ['image/jpeg', 'image/png', 'image/webp'].includes(f.type))
        setMensaje(validas.length !== nuevas.length ? 'Algunas fotos no se agregaron: deben ser JPG, PNG o WebP y pesar hasta 20 MB.' : '')
        setFotos(actuales => {
          const resultado = [...actuales]
          for (const foto of validas) {
            if (!resultado.some(f => f.name === foto.name && f.size === foto.size && f.lastModified === foto.lastModified)) resultado.push(foto)
          }
          return resultado
        })
        event.currentTarget.value = ''
      }} />
    </div>
    {fotos.length > 0 && <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p role="status" className="text-sm">{fotos.length} {fotos.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas'}</p>
        <button type="button" disabled={ocupado} onClick={() => setFotos([])} className="text-sm text-pink-200 underline disabled:opacity-50">Quitar todas</button>
      </div>
      <ul className="grid max-h-[32rem] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4" aria-label="Fotografías seleccionadas">
        {fotos.map((foto, indice) => <li key={`${foto.name}-${foto.size}-${foto.lastModified}`} className="min-w-0 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
          <VistaPrevia fotos={fotos} indice={indice} />
          <p className="truncate" title={foto.name}>{foto.name}</p>
          <button type="button" disabled={ocupado} aria-label={`Quitar ${foto.name}`} onClick={() => setFotos(actuales => actuales.filter((_, i) => i !== indice))} className="shrink-0 text-pink-200 underline disabled:opacity-50">Quitar</button>
        </li>)}
      </ul>
    </div>}
    <Button type="submit" disabled={ocupado || !fotos.length}>{ocupado ? 'Publicando fotografías…' : fotos.length ? `Publicar ${fotos.length} ${fotos.length === 1 ? 'foto' : 'fotos'}` : 'Publicar fotografías'}</Button>
    <p role="status">{mensaje}</p>
  </form>
}
