import type { Session } from '@supabase/supabase-js'
import { Loader2, LogOut, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input, Label, Textarea } from '@/components/ui/input'
import { CATEGORIAS } from '@/data/site'
import { supabase, supabaseListo, type Evento, type Solicitud } from '@/lib/supabase'

function Shell({ children, onSalir }: { children: React.ReactNode; onSalir?: () => void }) {
  return (
    <div className="min-h-svh bg-jmc-noche">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link to="/" aria-label="Volver al sitio">
            <img src="/logos/jmc_solo_icono.png" alt="JMC" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Ver sitio</Link>
            </Button>
            {onSalir && (
              <Button variant="outline" size="sm" onClick={onSalir}>
                <LogOut className="size-4" /> Salir
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-10">{children}</div>
    </div>
  )
}

function Login() {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function entrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return
    const d = new FormData(e.currentTarget)
    setCargando(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({
      email: String(d.get('email')),
      password: String(d.get('password')),
    })
    if (err) setError('Correo o contraseña incorrectos.')
    setCargando(false)
  }

  return (
    <Shell>
      <Card className="mx-auto max-w-md">
        <CardContent className="p-8">
          <h1 className="mb-6 text-2xl font-bold">Panel de administración</h1>
          {!supabaseListo ? (
            <p className="text-white/70">
              Supabase aún no está configurado. Copia <code className="rounded bg-white/10 px-1.5">.env.example</code> a{' '}
              <code className="rounded bg-white/10 px-1.5">.env</code>, pega tus claves y reinicia el servidor.
            </p>
          ) : (
            <form onSubmit={entrar} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo</Label>
                <Input id="email" name="email" type="email" required autoComplete="username" />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" required autoComplete="current-password" />
              </div>
              {error && (
                <p role="alert" className="text-sm text-red-300">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={cargando}>
                {cargando && <Loader2 className="size-4 animate-spin" />} Entrar
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Shell>
  )
}

function Panel({ session }: { session: Session }) {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [msg, setMsg] = useState('')

  const cargar = useCallback(async () => {
    if (!supabase) return
    const [ev, so] = await Promise.all([
      supabase.from('eventos').select('*').order('fecha', { ascending: false }),
      supabase.from('solicitudes').select('*').order('created_at', { ascending: false }),
    ])
    setEventos((ev.data as Evento[]) ?? [])
    setSolicitudes((so.data as Solicitud[]) ?? [])
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  async function crear(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return
    const form = e.currentTarget
    const d = new FormData(form)
    const { error } = await supabase.from('eventos').insert({
      titulo: String(d.get('titulo')).trim(),
      descripcion: String(d.get('descripcion')).trim() || null,
      categoria: String(d.get('categoria')),
      fecha: String(d.get('fecha')),
      lugar: String(d.get('lugar')).trim() || null,
      publicado: true,
    })
    setMsg(error ? 'Error al guardar el evento.' : 'Evento publicado ✔')
    if (!error) {
      form.reset()
      cargar()
    }
  }

  async function borrar(tabla: 'eventos' | 'solicitudes', id: string) {
    if (!supabase || !window.confirm('¿Eliminar este registro?')) return
    await supabase.from(tabla).delete().eq('id', id)
    cargar()
  }

  return (
    <Shell onSalir={() => supabase?.auth.signOut()}>
      <p className="mb-8 text-white/50">Sesión: {session.user.email}</p>

      <h2 className="mb-4 text-2xl font-bold">Nuevo evento</h2>
      <Card className="mb-10">
        <CardContent>
          <form onSubmit={crear} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" name="titulo" required maxLength={120} />
            </div>
            <div>
              <Label htmlFor="categoria">Tipo</Label>
              <select id="categoria" name="categoria" className="w-full rounded-2xl border border-white/20 bg-jmc-noche px-4 py-3">
                {Object.entries(CATEGORIAS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" name="fecha" type="date" required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="lugar">Lugar</Label>
              <Input id="lugar" name="lugar" maxLength={160} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" name="descripcion" maxLength={500} />
            </div>
            <div className="flex items-center gap-4 sm:col-span-2">
              <Button type="submit">Publicar evento</Button>
              {msg && <span role="status" className="text-sm text-white/70">{msg}</span>}
            </div>
          </form>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-2xl font-bold">Eventos ({eventos.length})</h2>
      <ul className="mb-10 space-y-3">
        {eventos.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <div>
              <p className="font-semibold">{e.titulo}</p>
              <p className="text-sm text-white/50">
                {CATEGORIAS[e.categoria]} · {e.fecha}
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => borrar('eventos', e.id)} aria-label={`Eliminar ${e.titulo}`}>
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
        {eventos.length === 0 && <li className="text-white/50">Aún no hay eventos.</li>}
      </ul>

      <h2 className="mb-4 text-2xl font-bold">Solicitudes para unirse ({solicitudes.length})</h2>
      <ul className="space-y-3">
        {solicitudes.map((s) => (
          <li key={s.id} className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <div>
              <p className="font-semibold">
                {s.nombre} {s.edad ? <span className="font-normal text-white/50">· {s.edad} años</span> : null}
              </p>
              <p className="text-sm text-pink-200">{s.telefono}</p>
              {s.mensaje && <p className="mt-1 text-sm text-white/70">{s.mensaje}</p>}
              <p className="mt-1 text-xs text-white/40">{new Date(s.created_at).toLocaleString('es-MX')}</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => borrar('solicitudes', s.id)} aria-label={`Eliminar solicitud de ${s.nombre}`}>
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
        {solicitudes.length === 0 && <li className="text-white/50">Aún no hay solicitudes.</li>}
      </ul>
    </Shell>
  )
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [listo, setListo] = useState(!supabase)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setListo(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!listo) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-jmc-noche">
        <Loader2 className="size-8 animate-spin text-jmc-rosa" />
      </div>
    )
  }
  return session ? <Panel session={session} /> : <Login />
}
