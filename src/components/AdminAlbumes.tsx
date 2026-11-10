import { useState, type FormEvent } from 'react'
import { prepararFoto } from '@/lib/prepararFoto'
import { galeriaStorage } from '@/lib/supabase'
import { carpetaCategoria, tituloAlbum } from '@/lib/albumes'
import { GALERIA } from '@/data/site'
import { Input, Label } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function AdminAlbumes() {
  const [ocupado, setOcupado] = useState(false)
  const [mensaje, setMensaje] = useState('')
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
    const fotos = datos.getAll('fotos').filter((f): f is File => f instanceof File)
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
    } catch {
      setMensaje(`Se publicaron ${publicadas} de ${fotos.length} fotos. Puedes reintentar con la misma selección.`)
    } finally {
      setOcupado(false)
    }
  }
  return <form onSubmit={publicar} className="jmc-glass-card mt-6 grid gap-4 rounded-2xl border border-white/10 p-5">
    <h3 className="text-xl font-bold">Álbumes de la galería</h3>
    <p>Elige la categoría y el mes. Si el álbum ya existe, las fotos se agregarán a él.</p>
    <div>
      <Label htmlFor="categoria-album">Categoría del álbum</Label>
      <select id="categoria-album" name="categoria" required disabled={ocupado} className="w-full rounded-2xl bg-jmc-noche p-3">
        {GALERIA.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
      </select>
    </div>
    <div><Label htmlFor="mes-album">Mes y año</Label><Input id="mes-album" name="mes" type="month" required disabled={ocupado} /></div>
    <div><Label htmlFor="fotos-album">Fotos del álbum (JPG, PNG o WebP, hasta 20 MB cada una)</Label><Input id="fotos-album" name="fotos" type="file" multiple required disabled={ocupado} accept="image/jpeg,image/png,image/webp" /></div>
    <Button type="submit" disabled={ocupado}>Publicar fotos del álbum</Button>
    <p role="status">{mensaje}</p>
  </form>
}
