import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea'
import ImagePreview, { ImagePreviewType } from '@/features/palette/components/ImagePreview'
import Palette from '@/features/palette/components/Palette'
import { cn } from '@/lib/utils'

interface GeneratedPaletteProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  colors?: string[],
  image?: ImagePreviewType
}

export default function GeneratedPalette({ colors, image, className, ...props }: GeneratedPaletteProps) {
  return (
    <div className={cn("flex flex-col gap-4 items-center justify-center w-full", className)} {...props}>
      <ScrollArea aria-orientation="horizontal" className="max-w-72 sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl py-3">
        <Palette colors={colors} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ImagePreview image={image} />
    </div>
  )
}
