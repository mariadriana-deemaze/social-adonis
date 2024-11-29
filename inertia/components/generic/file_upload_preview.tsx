import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

function PreviewThumbnail({ file }: { file: File }) {
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
    <div className="relative flex h-14 w-14 flex-col overflow-hidden rounded-md">
      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin text-muted" />}
      <div
        className={`absolute h-full w-full bg-black duration-1000 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      />
      <img ref={thumbnailRef} alt={file.name} className={isLoading ? 'opacity-0' : 'opacity-100'} />
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
