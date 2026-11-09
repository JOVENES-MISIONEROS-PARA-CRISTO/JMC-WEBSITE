const LADO_MAXIMO = 1600
const LIMITE_STORAGE = 5 * 1024 * 1024

export async function prepararFoto(foto: File): Promise<Blob> {
  const imagen = new Image()
  const url = URL.createObjectURL(foto)
  try {
    imagen.src = url
    await imagen.decode()
    const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.naturalWidth, imagen.naturalHeight))
    const lienzo = document.createElement('canvas')
    const contexto = lienzo.getContext('2d')
    if (!contexto) throw new Error('No se pudo preparar la imagen.')

    lienzo.width = Math.max(1, Math.round(imagen.naturalWidth * escala))
    lienzo.height = Math.max(1, Math.round(imagen.naturalHeight * escala))
    contexto.imageSmoothingQuality = 'high'
    contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height)
    const comprimida = await new Promise<Blob | null>(resolve =>
      lienzo.toBlob(resolve, 'image/webp', 0.82),
    )
    if (!comprimida) throw new Error('No se pudo comprimir la imagen.')
    if (escala === 1 && foto.size <= comprimida.size && foto.size <= LIMITE_STORAGE) return foto
    if (comprimida.size > LIMITE_STORAGE) throw new Error('La imagen supera el límite de almacenamiento.')
    return comprimida
  } finally {
    URL.revokeObjectURL(url)
  }
}
