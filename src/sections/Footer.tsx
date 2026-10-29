import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { SITIO } from '@/data/site'

const ANIO = new Date().getFullYear()

export function Footer() {
  const wa = SITIO.whatsapp ? `https://wa.me/${SITIO.whatsapp}` : ''
  return (
    <footer id="contacto" className="bg-jmc-noche px-5 pb-8 pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <img src="/logos/jmc_solo_icono.png" alt="JMC · Jóvenes Misioneros para Cristo" className="h-16 w-auto" />
          <p className="mt-4 max-w-xs text-white/60">Un grupo de jóvenes de la {SITIO.parroquia}, caminando juntos con Cristo.</p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold">Contacto</h3>
          <ul className="space-y-3 text-white/75">
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
                <a className="hover:text-white" href={wa} target="_blank" rel="noreferrer">
                  Escríbenos por WhatsApp
                </a>
              </li>
            )}
            {SITIO.correo && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-jmc-rosa" />
                <a className="hover:text-white" href={`mailto:${SITIO.correo}`}>
                  {SITIO.correo}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold">Síguenos</h3>
          <ul className="space-y-2 text-white/75">
            {SITIO.instagram && (
              <li>
                <a className="hover:text-white" href={SITIO.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
            )}
            {SITIO.facebook && (
              <li>
                <a className="hover:text-white" href={SITIO.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
            )}
            <li>
              <a className="hover:text-white" href={SITIO.sitioParroquia} target="_blank" rel="noreferrer">
                Sitio de la parroquia
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row">
        <p>© {ANIO} JMC · {SITIO.parroquia}, {SITIO.ciudad}</p>
        <a href="/admin" className="hover:text-white/70">
          Acceso administrador
        </a>
      </div>
    </footer>
  )
}
