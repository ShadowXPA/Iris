import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Rgb {
  red: number,
  green: number,
  blue: number
}

export function hexToRgb(hex: string): Rgb {
  const red = parseInt(hex.substring(1, 3), 16)
  const green = parseInt(hex.substring(3, 5), 16)
  const blue = parseInt(hex.substring(5, 7), 16)
  return { red, green, blue }
}

function linearizeColor(color: number): number {
  const c = color / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function getLuminance(rgb: Rgb): number {
  return 0.2126 * linearizeColor(rgb.red) + 0.7152 * linearizeColor(rgb.green) + 0.0722 * linearizeColor(rgb.blue)
}

function getContrastRatio(num1: number, num2: number): number {
  const lighter = Math.max(num1, num2)
  const darker = Math.min(num1, num2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function getForegroundForHex(hex: string): string {
  const rgb = hexToRgb(hex)
  const luminance = getLuminance(rgb)
  const contrastWithBlack = getContrastRatio(luminance, 0)
  const contrastWithWhite = getContrastRatio(luminance, 1)
  return contrastWithBlack >= contrastWithWhite ? "#000000" : "#ffffff"
}
