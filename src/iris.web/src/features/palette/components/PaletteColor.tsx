'use client'

import { Button } from '@/components/ui/Button'
import { toast } from '@/hooks/UseToast'
import { cn, getForegroundForHex } from '@/lib/utils'

interface PaletteColorProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  color: string,
}

async function copyColor(color: string) {
  try {
    await navigator.clipboard.writeText(color)
    toast({
      title: 'Copied to clipboard',
      description: `Color ${color} has been copied to your clipboard!`
    })
  } catch (err) { }
}

export default function PaletteColor({ color, className, ...props }: PaletteColorProps) {
  return (
    <Button className={cn("flex items-end justify-center p-4 size-24 rounded-none hover:opacity-80", className)} style={{ backgroundColor: `${color}`, color: getForegroundForHex(color) }} onClick={() => copyColor(color)} {...props}>
      {color}
    </Button>
  )
}
