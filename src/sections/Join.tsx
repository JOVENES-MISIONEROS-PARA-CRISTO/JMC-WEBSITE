import { CheckCircle2, Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Reveal } from '@/components/Reveal'
import { SITIO } from '@/data/site'
import { supabase } from '@/lib/supabase'

type Estado = 'idle' | 'enviando' | 'ok' | 'error'

export function Join() {
  const [estado, setEstado] = useState<Estado>('idle')
  const [error, setError] = useState('')

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const datos = new FormData(form)
    const edadTxt = String(datos.get('edad') ?? '').trim()
    const registro = {
      nombre: String(datos.get('nombre') ?? '').trim(),
      edad: edadTxt ? Number(edadTxt) : null,
      telefono: String(datos.get('telefono') ?? '').trim(),
      mensaje: String(datos.get('mensaje') ?? '').trim() || null,
    }

    setEstado('enviando')
    setError('')

    if (!supabase) {
      // Sin Supabase configurado: simulamos el envío para poder probar el diseño.
      await new Promise((r) => setTimeout(r, 600))
      setEstado('ok')
      form.reset()
      return
    }

    const { error: err } = await supabase.from('solicitudes').insert(registro)
    if (err) {
      setEstado('error')
      setError('No pudimos enviar tu registro. Inténtalo de nuevo en un momento.')
    } else {
      setEstado('ok')
      form.reset()
    }
  }

  return (
    <section id="unete" className="jmc-join-fade relative overflow-hidden bg-jmc-gradient px-5 pb-56 pt-64">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-pink-200">Únete</p>
          <h2 className="text-4xl font-extrabold sm:text-5xl">¿Quieres ser parte de JMC?</h2>
          <p className="mt-4 text-lg text-white/85">
            Déjanos tus datos y alguien del grupo se pondrá en contacto contigo. No necesitas experiencia, solo ganas de caminar con nosotros.
          </p>
          <ul className="mt-6 space-y-2 text-white/90">
            <li>📅 Reuniones: {SITIO.reuniones}</li>
            <li>📍 {SITIO.lugarReuniones}</li>
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-3xl bg-jmc-noche/90 p-7 shadow-2xl backdrop-blur sm:p-9">
            {estado === 'ok' ? (
              <div className="py-10 text-center" role="status">
                <CheckCircle2 className="mx-auto size-16 text-pink-300" />
                <h3 className="mt-4 text-2xl font-bold">¡Gracias por registrarte!</h3>
                <p className="mt-2 text-white/70">Pronto nos pondremos en contacto contigo. ¡Dios te bendiga!</p>
                <Button variant="outline" className="mt-6" onClick={() => setEstado('idle')}>
                  Registrar a otra persona
                </Button>
              </div>
            ) : (
              <form onSubmit={enviar} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input id="nombre" name="nombre" required minLength={2} maxLength={120} autoComplete="name" placeholder="Tu nombre" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="edad">Edad</Label>
                    <Input id="edad" name="edad" type="number" min={10} max={99} inputMode="numeric" placeholder="17" />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
                    <Input id="telefono" name="telefono" type="tel" required minLength={7} maxLength={20} autoComplete="tel" placeholder="392 123 4567" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="mensaje">Mensaje (opcional)</Label>
                  <Textarea id="mensaje" name="mensaje" maxLength={600} placeholder="Cuéntanos algo de ti" />
                </div>
                {estado === 'error' && (
                  <p role="alert" className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" className="w-full" disabled={estado === 'enviando'}>
                  {estado === 'enviando' ? <Loader2 className="size-5 animate-spin" /> : null}
                  {estado === 'enviando' ? 'Enviando…' : 'Enviar registro'}
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
