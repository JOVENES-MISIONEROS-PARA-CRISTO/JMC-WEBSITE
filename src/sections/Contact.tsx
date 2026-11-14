import { Church, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { SITIO } from '@/data/site'
import { SectionTitle } from '@/components/Reveal'
import { Button } from '@/components/ui/button'

const enlaces = [
  { nombre: 'Facebook', url: SITIO.facebook, icono: <img src="/icons/facebook.svg" alt="" width="20" height="20" /> },
  { nombre: 'Instagram', url: SITIO.instagram, icono: <img src="/icons/instagram.svg" alt="" width="20" height="20" /> },
  { nombre: 'Página de la parroquia', url: SITIO.sitioParroquia, icono: <Church size={20} className="text-black" aria-hidden="true" /> },
]

export function Contact() {
  const wa = SITIO.whatsapp ? `https://wa.me/${SITIO.whatsapp}` : ''
  return (
    <section id="contacto" aria-label="Contacto">
      <SectionTitle centered kicker={SITIO.ciudad} title="Contacto" subtitle="Consulta los datos de la parroquia y sus enlaces." />
      <div className="section-layout mx-auto grid max-w-5xl justify-items-center gap-8 text-center sm:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-bold">Datos de la parroquia</h3>
          <ul className="space-y-3 text-jmc-noche/75 [&>li]:justify-center">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-jmc-rosa" />
              {SITIO.direccion}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-jmc-rosa" />
              Parroquia: {SITIO.telefonoParroquia}
            </li>
            {wa && (
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-jmc-rosa" />
                <a className="break-words hover:text-jmc-morado" href={wa} target="_blank" rel="noreferrer">
                  Escríbenos por WhatsApp
                </a>
              </li>
            )}
            {SITIO.correo && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-jmc-rosa" />
                <a className="break-words hover:text-jmc-morado" href={`mailto:${SITIO.correo}`}>
                  {SITIO.correo}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold">Síguenos</h3>
          <ul className="flex flex-wrap justify-center gap-3">
            {enlaces.map(({ nombre, url, icono }) => (
              <li key={nombre}>
                <Button asChild variant="light" className="size-11 border border-jmc-morado/20 p-0">
                  <a href={url} target="_blank" rel="noreferrer" aria-label={nombre}>{icono}</a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  )
}
