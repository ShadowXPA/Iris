import { Constants } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

const generatePaletteSchema = z.object({
  url: z.union([z.url({ protocol: /^https?$/ }).trim(), z.literal('')]).optional(),
  file: z.file().mime(Constants.ALLOWED_MIME_TYPES).max(Constants.MAX_FILE_SIZE).optional(),
  colors: z.int().min(1),
}).superRefine((data, ctx) => {
  if (!data.url && !data.file) {
    ctx.addIssue({
      code: 'custom',
      message: "A URL is required",
      path: ['url']
    })

    ctx.addIssue({
      code: 'custom',
      message: "A file is required",
      path: ['file']
    })
  }
})

export type GeneratePaletteSchema = z.infer<typeof generatePaletteSchema>

export const paletteSchemaResolver = zodResolver(generatePaletteSchema)
