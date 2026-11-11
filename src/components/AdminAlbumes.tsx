import { useEffect, useState, type FormEvent } from 'react'
import { prepararFoto } from '@/lib/prepararFoto'
import { galeriaStorage } from '@/lib/supabase'
import { carpetaCategoria, tituloAlbum } from '@/lib/albumes'
import { GALERIA } from '@/data/site'
import { Input, Label } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function VistaPrevia({ foto }: { foto: File }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const preview = URL.createObjectURL(foto)
    setUrl(preview)
    setError(false)
    return () => URL.revokeObjectURL(preview)
  }, [foto])

  return <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-black/20">
    {error ? <p className="p-3 text-center text-xs text-white/65">No se pudo mostrar la vista previa.</p> : url ? <img src={url} alt={`Vista previa de ${foto.name}`} className="h-full w-full object-contain" loading="lazy" onError={() => setError(true)} /> : null}
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
          <VistaPrevia foto={foto} />
          <p className="truncate" title={foto.name}>{foto.name}</p>
          <button type="button" disabled={ocupado} aria-label={`Quitar ${foto.name}`} onClick={() => setFotos(actuales => actuales.filter((_, i) => i !== indice))} className="shrink-0 text-pink-200 underline disabled:opacity-50">Quitar</button>
        </li>)}
      </ul>
    </div>}
    <Button type="submit" disabled={ocupado || !fotos.length}>{ocupado ? 'Publicando fotografías…' : fotos.length ? `Publicar ${fotos.length} ${fotos.length === 1 ? 'foto' : 'fotos'}` : 'Publicar fotografías'}</Button>
    <p role="status">{mensaje}</p>
  </form>
}
