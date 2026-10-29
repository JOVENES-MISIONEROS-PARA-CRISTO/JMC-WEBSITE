import type { Evento } from '@/lib/supabase'

/**
 * ⚠️ Datos editables del sitio. Todo lo marcado "POR CONFIRMAR" debe
 * reemplazarse con la información real del grupo antes de publicar.
 */
export const SITIO = {
  nombre: 'Jóvenes Misioneros para Cristo',
  siglas: 'JMC',
  parroquia: 'Parroquia del Señor de la Misericordia',
  ciudad: 'Ocotlán, Jalisco',
  direccion: 'Calle Coronel Guerrero 52, Ocotlán, Jalisco, 47800',
  telefonoParroquia: '(392) 922 00 03',
  sitioParroquia: 'https://www.elprodigiodeocotlan.com/',
  // POR CONFIRMAR ↓
  reuniones: 'Día y hora por confirmar',
  lugarReuniones: 'Salón parroquial (por confirmar)',
  whatsapp: '', // ej. '523921234567' (código de país + número, sin + ni espacios)
  instagram: '', // ej. 'https://instagram.com/jmc_ocotlan'
  facebook: '',
  correo: '',
}

export type Actividad = {
  titulo: string
  texto: string
  icono: 'cruz' | 'montana' | 'camino' | 'manos' | 'musica' | 'estrella'
}

export const ACTIVIDADES: Actividad[] = [
  {
    titulo: 'Retiros espirituales',
    texto: 'Días para detenernos, orar en comunidad y encontrarnos con Cristo lejos del ruido de todos los días.',
    icono: 'cruz',
  },
  {
    titulo: 'Paseo al Cubilete',
    texto: 'Peregrinamos juntos al Cerro del Cubilete: camino, oración, convivencia y mucha alegría.',
    icono: 'montana',
  },
  {
    titulo: 'Paseo a Talpa',
    texto: 'Un viaje de fe y amistad al santuario de Talpa, compartiendo el camino como grupo.',
    icono: 'camino',
  },
  {
    titulo: 'Servicio y misión',
    texto: 'Salimos al encuentro de quien nos necesita: visitas, colectas y apoyo a la comunidad parroquial.',
    icono: 'manos',
  },
  {
    titulo: 'Convivencias',
    texto: 'Convivios, dinámicas y momentos para fortalecer la amistad dentro del grupo.',
    icono: 'musica',
  },
  {
    titulo: 'Y mucho más…',
    texto: 'Cada año surgen nuevas actividades. ¡Ven y propón la próxima aventura!',
    icono: 'estrella',
  },
]

export const PILARES = [
  { titulo: 'Fe', texto: 'Crecemos en la amistad con Jesús a través de la oración y los sacramentos.' },
  { titulo: 'Comunidad', texto: 'Caminamos juntos: aquí nadie es un número, todos somos familia.' },
  { titulo: 'Misión', texto: 'Llevamos el amor de Cristo a otros jóvenes y a nuestra parroquia.' },
]

export const CATEGORIAS: Record<Evento['categoria'], string> = {
  retiro: 'Retiro',
  paseo: 'Paseo',
  peregrinacion: 'Peregrinación',
  reunion: 'Reunión',
  servicio: 'Servicio',
  otro: 'Evento',
}

/** Se muestran solo si Supabase aún no está configurado o no hay eventos publicados. */
export const EVENTOS_EJEMPLO: Evento[] = [
  {
    id: 'ej-1',
    titulo: 'Próximo retiro JMC',
    descripcion: 'Fecha y lugar por confirmar. ¡Estén atentos!',
    categoria: 'retiro',
    fecha: '2026-12-12',
    lugar: 'Por confirmar',
    publicado: true,
  },
  {
    id: 'ej-2',
    titulo: 'Paseo al Cubilete',
    descripcion: 'Salida grupal. Detalles y cuota por confirmar.',
    categoria: 'paseo',
    fecha: '2027-01-30',
    lugar: 'Cerro del Cubilete, Guanajuato',
    publicado: true,
  },
]

/**
 * Galería. Pon tus fotos en `public/galeria/` y agrega `src: '/galeria/nombre.jpg'`.
 * Sin `src` se muestra un recuadro decorativo.
 */
export type FotoGaleria = { titulo: string; src?: string; alto: 'normal' | 'alto' }
export const GALERIA: FotoGaleria[] = [
  { titulo: 'Retiros', alto: 'alto' },
  { titulo: 'Cubilete', alto: 'normal' },
  { titulo: 'Talpa', alto: 'normal' },
  { titulo: 'Convivencias', alto: 'normal' },
  { titulo: 'Servicio', alto: 'alto' },
  { titulo: 'Nuestro grupo', alto: 'normal' },
]
