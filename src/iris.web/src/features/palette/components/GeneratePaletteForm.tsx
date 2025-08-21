'use client'

import { Loading } from '@/components/Icon'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { getPalette } from '@/features/palette/actions/palette'
import { ImagePreviewType } from '@/features/palette/components/ImagePreview'
import { GeneratePaletteSchema, paletteSchemaResolver } from '@/features/palette/schemas/PaletteSchema'
import { Constants } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface GeneratePaletteFormProps extends React.HtmlHTMLAttributes<HTMLFormElement> {
  onPaletteGenerated?: (colors: string[], image: ImagePreviewType) => void
}

export default function GeneratePaletteForm({ onPaletteGenerated, className, ...props }: GeneratePaletteFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<GeneratePaletteSchema>({
    resolver: paletteSchemaResolver,
    defaultValues: {
      colors: 5,
      url: '',
    },
  })

  function resetForm() {
    form.reset()
  }

  async function onSubmit(values: GeneratePaletteSchema) {
    setLoading(true)

    if (onPaletteGenerated)
      onPaletteGenerated(await getPalette(values), { url: values.url, file: values.file })

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("", className)} {...props}>
        <fieldset className='flex flex-col gap-4' disabled={loading}>
          <div className="flex flex-wrap items-stretch gap-4">
            <Tabs defaultValue="url" className="flex-auto" onValueChange={resetForm}>
              <TabsContent value="url" className="">
                <FormField control={form.control} name="url" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image:</FormLabel>
                    <FormControl><Input {...field} placeholder={"https://..."} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </TabsContent>
              <TabsContent value="file" className="">
                <FormField control={form.control} name="file" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image:</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept={Constants.ALLOWED_MIME_TYPES.join(',')}
                        ref={field.ref}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          field.onChange(file)
                        }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </TabsContent>
              <TabsList>
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="file">File</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex-1">
              <FormField control={form.control} name="colors" render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      ref={field.ref}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(e.target.value === "" ? 5 : Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
          <Button className="w-full" type="submit">{loading && <Loading className="animate-spin" />}Generate palette</Button>
        </fieldset>
      </form>
    </Form>
  )
}
