'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export interface ImagePreviewType {
  url?: string,
  file?: File,
}

interface ImagePreviewProps extends React.HtmlHTMLAttributes<HTMLImageElement> {
  image?: ImagePreviewType
}

export default function ImagePreview({ image, className, ...props }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string>()

  useEffect(() => {
    if (!image) return

    const file = image.file
    const url = image.url

    if (file) {
      const objUrl = URL.createObjectURL(file)
      setPreview(objUrl)

      return () => {
        URL.revokeObjectURL(objUrl)
      }
    } else if (url) {
      setPreview(url)
    } else {
      setPreview(undefined)
    }
  }, [image])

  if (!preview) return null

  return (
    <img src={preview} alt="Palette image" className={cn("rounded-md max-w-80 max-h-80", className)} {...props} />
  )
}
