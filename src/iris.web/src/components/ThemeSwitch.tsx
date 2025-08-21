'use client'

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/Button"
import { Moon, Sun, ThemeLightDark } from "@/components/Icon"
import { HtmlHTMLAttributes, ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ThemeSwitchProps extends HtmlHTMLAttributes<HTMLDivElement> {
}

export default function ThemeSwitch({ className, ...props }: ThemeSwitchProps) {
  const [isClient, setClient] = useState(false)
  const { theme, setTheme, themes } = useTheme()

  useEffect(() => {
    setClient(true)
  }, [isClient])

  if (!isClient) return null

  return (
    <div className={cn("fixed top-4 right-4", className)} {...props}>
      <Button size={'icon'} onClick={() => setTheme(getNextTheme(themes, theme))}>{getThemeIcon(theme)}</Button>
    </div>
  )
}

function getNextTheme(themes: string[], theme?: string): string {
  const indexOfTheme = themes.indexOf(theme ?? 'system')
  if (indexOfTheme === -1) return 'system'
  return themes[(indexOfTheme + 1) % themes.length]
}

function getThemeIcon(theme?: string): ReactNode {
  switch (theme) {
    case 'light':
      return <Sun />
    case 'dark':
      return <Moon />
    case 'system':
    default:
      return <ThemeLightDark />
  }
}
