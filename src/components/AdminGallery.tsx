import { useState, type FormEvent } from 'react'
import { GALERIA } from '@/data/site'
import { galeriaStorage } from '@/lib/supabase'
import { prepararFoto } from '@/lib/prepararFoto'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'

const numero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })
const porcentaje = new Intl.NumberFormat('es-MX', { style: 'percent', maximumFractionDigits: 1 })

function peso(bytes: number) {
  if (bytes < 1000) return `${bytes} B`
  if (bytes < 1_000_000) return `${numero.format(bytes / 1000)} kB`
  return `${numero.format(bytes / 1_000_000)} MB`
}

function resumen(original: number, publicado: number) {
  const diferencia = original - publicado
  const cambio = porcentaje.format(Math.abs(diferencia) / original)
  const etiqueta = diferencia < 0 ? 'Aumento' : 'Ahorro'
  return `Foto publicada. Original: ${peso(original)} · Publicada: ${peso(publicado)} · ${etiqueta}: ${cambio}`
}

export function AdminGallery() {
  const [ocupado, setOcupado] = useState(false)
  const [mensaje, setMensaje] = useState('')

  async function publicar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!galeriaStorage || ocupado) return
    const form = event.currentTarget
    const datos = new FormData(form)
    const foto = datos.get('foto')
    if (!(foto instanceof File) || !['image/jpeg', 'image/png', 'image/webp'].includes(foto.type) || !foto.size || foto.size > 20 * 1024 * 1024) {
      setMensaje('Elige una imagen JPG, PNG o WebP de hasta 20 MB.')
      return
    }
    setOcupado(true)
    setMensaje('Preparando la foto…')
    try {
      const imagen = await prepararFoto(foto)
      setMensaje('Subiendo la foto…')
      const { error } = await galeriaStorage.upload(String(datos.get('espacio')), imagen, {
        contentType: imagen.type, cacheControl: '0', upsert: true,
      })
      if (error) {
        setMensaje('No se pudo subir la foto. Revisa la conexión y vuelve a intentarlo.')
        return
      }
      form.reset()
      setMensaje(resumen(foto.size, imagen.size))
    } catch {
      setMensaje('No se pudo publicar la foto. Comprueba que la imagen se abre correctamente y vuelve a intentarlo.')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-2xl font-bold">Fotos de la galería</h2>
      <form onSubmit={publicar} className="jmc-glass-card grid gap-4 rounded-2xl border border-white/10 p-5">
        <div>
          <Label htmlFor="espacio">Foto que quieres actualizar</Label>
          <select disabled={ocupado} className="w-full rounded-2xl bg-jmc-noche p-3" id="espacio" name="espacio">
            {GALERIA.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="foto">Imagen JPG, PNG o WebP de hasta 20 MB</Label>
          <Input disabled={ocupado} id="foto" name="foto" required type="file" accept="image/jpeg,image/png,image/webp" />
        </div>
        <Button disabled={ocupado} type="submit">Publicar foto</Button>
        <p role="status">{mensaje}</p>
      </form>
    </section>
  )
}
