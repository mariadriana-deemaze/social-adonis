import React, { useEffect, useMemo, useRef } from 'react'
import { MAX_POST_CONTENT_SIZE, MIN_POST_CONTENT_SIZE } from '#validators/post'
import FileUploadPreview from '@/components/generic/file_upload_preview'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use_toast'
import { cn } from '@/lib/utils'
import { useForm, usePage } from '@inertiajs/react'
import { Paperclip } from 'lucide-react'
import { PostResponse } from 'app/interfaces/post'
import { route } from '@izzyjs/route/client'
import { UserResponse } from '#interfaces/user'
import HighlightedInput from '@/components/generic/highlighted_input'
import { UserAvatar } from '@/components/generic/user_avatar'

const MAX_FILES = 3

export default function Form({
  setOpen,
  post,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  post?: PostResponse
}) {
  const { errors } = usePage().props

  const { toast } = useToast()

  const {
    data,
    setData,
    post: postData,
    patch: patchData,
    processing,
  } = useForm<{
    content: string
    images: FileList | null
    audios: FileList | null
    videos: FileList | null
    documents: FileList | null
  }>({
    content: post?.content || '',
    images: null,
    audios: null,
    videos: null,
    documents: null,
  })

  const uploadImages = useRef<HTMLInputElement | null>(null)

  const method = post ? 'patch' : 'post'

  async function handleFetch(searchTerm: string) {
    const request = await fetch(
      route('users.index', {
        qs: {
          search: searchTerm,
        },
      }).path
    )

    if (request.ok) {
      const json = await request.json()
      return json.data
    }

    return []
  }

  function addFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    if (e.target.files?.length > MAX_FILES) {
      toast({
        title: 'File upload error.',
        description: `You are only allowed to upload a maximum of ${MAX_FILES} files at a time.`,
      })
      return
    }
    setData('images', e.target.files)
  }

  function mentionParser(currentContent: string, selected: UserResponse[]) {
    console.log('mentionParser ->', selected)
    let original = currentContent
    return selected.reduce((acc, item) => {
      acc = acc
        .trim()
        .replace(
          '@' + item.username,
          `<a href="/${item.username}" style="color: #3b82f6; background: white; font-weight: 700; letter-spacing: -0.20px;">$&</a>`
        )
      return acc
    }, original)
  }

  function itemSelect(
    item: UserResponse,
    searchTerm: string,
    select: (item: UserResponse) => void
  ) {
    const splitContent = data.content.split(' ')
    setData(
      'content',
      data.content.replace(
        searchTerm ? splitContent[splitContent.length - 1] : searchTerm,
        '@' + item.username
      )
    )
    select(item)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (method === 'patch' && data) {
      patchData(route('posts.update', { params: { id: post?.id! } }).path, {
        preserveState: false,
        onFinish: () => setOpen(false),
      })
    } else {
      postData(route('posts.store').path, {
        preserveState: false,
        onFinish: () => setOpen(false),
      })
    }
  }

  const invalidPostContent = useMemo(
    () =>
      data.content.length < MIN_POST_CONTENT_SIZE || data.content.length > MAX_POST_CONTENT_SIZE,
    [data.content.length]
  )

  useEffect(() => {
    if (errors) {
      toast({
        title: 'There was an issue with publishing your post.',
        description: errors.content || errors.images,
      })
    }
  }, [errors])

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(processing ? 'opacity-20 pointer-events-none' : 'opacity-100')}
    >
      <div className="flex flex-col w-full mb-6 gap-2">
        <Label htmlFor="content" className="text-left">
          Post content
        </Label>
        <div className="relative">
          <HighlightedInput<UserResponse>
            id="content"
            className="no-scrollbar z-10"
            captureTrigger={new RegExp(/@\w+/g)}
            value={data.content}
            parser={mentionParser}
            fetcher={handleFetch}
            onChange={(e) => setData('content', e.target.value)}
            Item={({ item, searchTerm, select }) => (
              <div
                className={`react-${item.username} flex flex-row gap-2 items-center text-sm truncate text-ellipsis`}
                onClick={() => itemSelect(item, searchTerm, select)}
              >
                <UserAvatar user={item} className="h-6 w-6" />
                <div className="flex flex-col py-1 px-0">
                  <p className="font-medium text-xs">{item.fullname}</p>
                  <p className="text-xs text-blue-500">@{item.username}</p>
                </div>
              </div>
            )}
          />
        </div>
        <span className={cn('text-xs', invalidPostContent ? 'text-red-700' : 'text-gray-500')}>
          {data.content.length}/{MAX_POST_CONTENT_SIZE}
        </span>
      </div>

      {/* // TODO: Different uploaders per file type. Abstract to single button, and apply switch to input accordingly. */}
      <div className="flex flex-col bg-gray-100 p-2 rounded-e-lg gap-2">
        <input
          ref={uploadImages}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={addFiles}
        />
        <Button
          className="gap-2 text-gray-600"
          variant="outline"
          type="button"
          onClick={() => uploadImages.current?.click()}
        >
          <Paperclip size={15} />
          Attach images
        </Button>
        <FileUploadPreview fileList={data.images} />
        <p className="text-xs text-gray-600">{data.images?.length || 0} selected.</p>
      </div>

      <Button className="mt-5" loading={processing} disabled={invalidPostContent} type="submit">
        {method === 'post' ? 'Publish' : 'Update'}
      </Button>
    </form>
  )
}
