'use client'

import { Card, CardContent } from '@/components/ui/Card'
import GeneratedPalette from '@/features/palette/components/GeneratedPalette'
import GeneratePaletteForm from '@/features/palette/components/GeneratePaletteForm'
import { ImagePreviewType } from '@/features/palette/components/ImagePreview'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface PaletteGeneratorProps extends React.HtmlHTMLAttributes<HTMLDivElement> {

}

export default function PaletteGenerator({ className, ...props }: PaletteGeneratorProps) {
  const [colors, setColors] = useState<string[]>()
  const [image, setImage] = useState<ImagePreviewType>()

  function onPaletteGenerated(colors: string[], image: ImagePreviewType) {
    setColors(colors)
    setImage(image)
  }

  return (
    <div className={cn("flex flex-col gap-8 items-center justify-center", className)} {...props}>
      <Card>
        <CardContent>
          <GeneratePaletteForm onPaletteGenerated={onPaletteGenerated} />
        </CardContent>
      </Card>
      <GeneratedPalette colors={colors} image={image} />
    </div>
  )
}
