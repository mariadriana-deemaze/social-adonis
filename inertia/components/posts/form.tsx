import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MAX_POST_CONTENT_SIZE, MIN_POST_CONTENT_SIZE } from '#validators/post'
import FileUploadPreview from '@/components/generic/file_upload_preview'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use_toast'
import { cn } from '@/lib/utils'
import { useForm, usePage } from '@inertiajs/react'
import { Paperclip } from 'lucide-react'
import { PostResponse } from 'app/interfaces/post'
import { route } from '@izzyjs/route/client'
import { /* AutoComplete, */ Option } from '@/components/ui/autocomplete'
import { UserResponse } from '#interfaces/user'

const MAX_FILES = 3

export default function Form({
  setOpen,
  post,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  post?: PostResponse
}) {
  const [openUserAutocomplete, setOpenUserAutocomplete] = useState(false)
  const [usersList, setUsersList] = useState<Option[]>([])
  const [value] = useState<Option>()
  const [isLoading] = useState(false)
  const [isDisabled] = useState(false)

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
  // const autoCompleteInput = useRef<HTMLInputElement | null>(null)

  const method = post ? 'patch' : 'post'

  function postContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    // TODO: Approach differently, as capture mode
    const event = e.nativeEvent as InputEvent

    if (event.data === '@') {
      // Enter autocomplete mode
      setOpenUserAutocomplete(true)
      // Set focus
    }

    setData('content', e.target.value)
  }

  async function fetchUserList(searchTerm: string) {
    const request = await fetch(
      route('users.index', {
        qs: {
          search: searchTerm,
        },
      }).path
    )
    if (request.ok) {
      const json = await request.json()
      setUsersList(
        json.data.map((user: UserResponse) => {
          return {
            label: `@${user.username}`,
            value: user.username,
          }
        })
      )
    }
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

  useEffect(() => {
    fetchUserList('SOA_')
  }, [openUserAutocomplete])

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
          <span className="text-sm">
            Current value: {value ? value?.label : 'No value selected'}
          </span>
          <span className="text-sm">Loading state: {isLoading ? 'true' : 'false'}</span>
          <span className="text-sm">Disabled: {isDisabled ? 'true' : 'false'}</span>

          <Textarea
            id="content"
            className="no-scrollbar"
            value={data.content}
            onChange={postContentChange}
          />
          {openUserAutocomplete && (
            <div className="absolute w-full -bottom-20 border border-slate-200 rounded-sm bg-white shadow-lg">
              {/* // TODO: Approach differently, as capture mode */}

              {usersList.map((item) => (
                <p key={`item-${item.value}`}>{item.label}</p>
              ))}
              {/* <AutoComplete
                ref={autoCompleteInput}
                options={usersList}
                emptyMessage="No matching user."
                placeholder="Find users"
                isLoading={isLoading}
                onValueChange={setValue}
                value={value}
                disabled={isDisabled}
              /> */}
            </div>
          )}
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
