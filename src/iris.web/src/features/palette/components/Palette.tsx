import PaletteColor from '@/features/palette/components/PaletteColor'
import { cn } from '@/lib/utils'

interface PaletteProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  colors?: string[],
}

export default function Palette({ colors, className, ...props }: PaletteProps) {
  return (
    <div className={cn("", className)} {...props}>
      <div className="flex items-center justify-center rounded-md overflow-hidden">
        {colors?.map((color, i) => (
          <PaletteColor key={i} color={color} />
        ))}
      </div>
    </div>
  )
}
