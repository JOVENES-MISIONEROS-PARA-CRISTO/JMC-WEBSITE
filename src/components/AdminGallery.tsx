import { useState, type FormEvent } from 'react'
import { GALERIA } from '@/data/site'
import { galeriaStorage } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'

export function AdminGallery() {
  const [ocupado, setOcupado] = useState(false)
  const [mensaje, setMensaje] = useState('')

  async function publicar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!galeriaStorage || ocupado) return
    const form = event.currentTarget
    const datos = new FormData(form)
    const foto = datos.get('foto')
    if (!(foto instanceof File) || !['image/jpeg', 'image/png', 'image/webp'].includes(foto.type) || !foto.size || foto.size > 5242880) {
      setMensaje('Elige una imagen JPG, PNG o WebP de hasta 5 MB.')
      return
    }
    setOcupado(true)
    setMensaje('')
    try {
      const { error } = await galeriaStorage.upload(String(datos.get('espacio')), foto, {
        contentType: foto.type, cacheControl: '0', upsert: true,
      })
      if (error) throw error
      form.reset()
      setMensaje('Foto publicada en la galería.')
    } catch {
      setMensaje('No se pudo publicar la foto. Revisa la conexión y los permisos del bucket.')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-2xl font-bold">Fotos de la galería</h2>
      <form onSubmit={publicar} className="grid gap-4 rounded-2xl border border-white/10 p-5">
        <div>
          <Label htmlFor="espacio">Foto que quieres actualizar</Label>
          <select className="w-full rounded-2xl bg-jmc-noche p-3" id="espacio" name="espacio">
            {GALERIA.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="foto">Imagen JPG, PNG o WebP de hasta 5 MB</Label>
          <Input id="foto" name="foto" required type="file" accept="image/jpeg,image/png,image/webp" />
        </div>
        <Button disabled={ocupado} type="submit">{ocupado ? 'Subiendo…' : 'Publicar foto'}</Button>
        <p role="status">{mensaje}</p>
      </form>
    </section>
  )
}
