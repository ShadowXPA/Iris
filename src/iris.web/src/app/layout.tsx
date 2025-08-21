import type { Metadata } from "next"
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/Toaster'
import ThemeSwitch from '@/components/ThemeSwitch'

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
})

const notoMono = Noto_Sans_Mono({
  variable: "--font-noto-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Iris",
  description: "Generate color palettes from images",
}

const themes = ['light', 'dark']

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSans.variable} ${notoMono.variable} antialiased`}>
        <ThemeProvider enableSystem themes={themes}>
          <ThemeSwitch />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
