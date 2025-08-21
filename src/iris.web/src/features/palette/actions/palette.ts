'use server'

import { GeneratePaletteSchema } from '@/features/palette/schemas/PaletteSchema'
import { env } from 'process'

export async function getPalette(paletteSettings: GeneratePaletteSchema) {
  const formData = new FormData()

  formData.append('colors', paletteSettings.colors.toString())

  if (paletteSettings.url) {
    formData.append('url', paletteSettings.url)
  }

  if (paletteSettings.file) {
    formData.append('file', paletteSettings.file, paletteSettings.file.name)
  }

  const response = await fetch(`${env.BASE_API_URL}${env.PALETTE_API_URL}`, {
    method: 'post',
    body: formData,
  })

  return await response.json()
}
