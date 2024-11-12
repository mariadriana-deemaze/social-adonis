import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PreviewThumbnail({ file, className }: { file: File; className?: string }) {
  const [isLoading, setIsLoading] = useState(true)

  const thumbnailRef = useRef<HTMLImageElement>(null)

  function handlePreview() {
    setIsLoading(true)

    const fileReader = new FileReader()

    fileReader.onload = () => {
      const { result } = fileReader
      if (!result) return
      // @ts-ignore
      thumbnailRef.current.src = String(result)
      setIsLoading(false)
    }

    fileReader.readAsDataURL(file)
  }

  useEffect(handlePreview, [file])

  return (
    <div className={cn('relative flex flex-col w-14 h-14 overflow-hidden rounded-md', className)}>
      {isLoading && <Loader2 className="h-5 w-5 mr-2 animate-spin text-muted" />}
      <div
        className={`absolute w-full h-full bg-black duration-1000 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      />
      <img ref={thumbnailRef} alt={file.name} className={`object-cover w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  )
}

export default function FileUploadPreview({ fileList }: { fileList: FileList | null }) {
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    const list: File[] = []
    Array.from(fileList ?? []).forEach((file) => {
      list.push(file)
    })
    setFiles(list)
  }, [fileList])

  return (
    <ol className="flex flex-row gap-2">
      {files.map((file, i) => (
        <PreviewThumbnail file={file} key={i} />
      ))}
    </ol>
  )
}
