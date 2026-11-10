import type { FotoGaleria } from '@/data/site'

export function carpetaCategoria(categoria: FotoGaleria) {
  return `albumes/${categoria.id}`
}

export function tituloAlbum(categoria: FotoGaleria, mes: string) {
  const [anio, numero] = mes.split('-')
  const nombre = new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(new Date(Number(anio), Number(numero) - 1, 1))
  const titulo = categoria.id === 'retiros' ? 'Retiro' : categoria.titulo
  return `${titulo} ${nombre[0].toUpperCase()}${nombre.slice(1)} ${anio}`
}

