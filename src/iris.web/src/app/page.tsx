import PaletteGenerator from '@/features/palette/components/PaletteGenerator'
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center py-12 px-4 w-full">
      <header className="flex flex-col gap-8 items-center justify-center">
        <div className="flex flex-wrap gap-8 items-center">
          <Image src="/iris.svg" alt="Iris logo" width={75} height={75} priority />
          <h1 className="font-bold text-4xl">Iris</h1>
        </div>
        <div>Generate color palettes from images</div>
      </header>
      <PaletteGenerator />
    </div>
  )
}
