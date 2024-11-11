import { useMemo, useState } from 'react'
import { Link } from '@inertiajs/react'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Link as LinkIcon,
  EllipsisVerticalIcon,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UpdatePost } from '@/components/posts/update'
import { DeletePost } from '@/components/posts/delete'
import { PostResponse } from 'app/interfaces/post'
import { AttachmentResponse } from 'app/interfaces/attachment'
import { formatDistanceToNow } from 'date-fns'
import type { UUID } from 'crypto'

const userLink = (id: UUID) => `/users/${id}`
const postLink = (id: UUID) => `/posts/${id}`

function PostContentParser({ post }: { post: PostResponse }) {
  const content = useMemo(() => {
    if (post.link) {
      return post.content.replace(
        post.link.link,
        `<a class="text-cyan-600" href=${post.link.link} target="_blank">${post.link.link}</a>`
      )
    }
    return post.content
  }, [post])
  return <div className="pb-5 post-content" dangerouslySetInnerHTML={{ __html: content }} />
}

function LinkPreview({ preview }: { preview: NonNullable<PostResponse['link']> }) {
  return (
    <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-48 w-full max-w-[600px] bg-slate-100 hover:bg-slate-200 duration-500 border border-slate-200 p-3 rounded-md">
      <div className="flex flex-row max-w-56 justify-center aspect-auto flex-shrink-0 relative rounded-lg">
        <img
          src={preview.metadata.thumbnail}
          className="z-[1] rounded-lg max-w-full aspect-auto w-60 object-cover"
        />
      </div>
      <div className="relative flex flex-col gap-2 lg:px-5 w-full overflow-hidden">
        <div>
          <h4 className="truncate text-ellipsis font-bold">{preview.metadata.title}</h4>
          <a
            href={preview.link}
            target="_blank"
            className="flex flex-row underline font-medium text-sm text-cyan-600 items-center truncate text-ellipsis"
          >
            <span className="relative">
              <LinkIcon className="h-3" />
            </span>
            {preview.link}
          </a>
        </div>
        <p className="text-sm truncate text-wrap line-clamp-5">{preview.metadata.description}</p>
      </div>
    </div>
  )
}

function PostImage({ image }: { image: AttachmentResponse }) {
  const [loaded, setLoaded] = useState(false)

  const mbSize = useMemo(() => (image.metadata.size / 1048576).toFixed(2), [image])

  return (
    <>
      <div
        className={`absolute flex flex-col bg-slate-900 duration-700 w-full h-full m-auto items-center z-[5] ${loaded ? 'opacity-0' : 'opacity-85 pointer-events-none'}`}
      >
        <Loader2 className="h-10 w-10 animate-spin text-muted m-auto" />
      </div>
      <div className="group flex flex-row justify-center aspect-auto min-h-[calc(100vh_-_300px)] relative w-full rounded-lg overflow-hidden">
        <div className="opacity-0 group-hover:opacity-100 absolute z-[5] left-2 bottom-2 bg-slate-900 text-white rounded-sm px-2 duration-200">
          <p className="text-sm font-medium">{image.metadata.filename}</p>
          <p className="text-sm">{mbSize} MB</p>
        </div>
        <img
          onLoad={() => setLoaded(true)}
          src={image.link}
          className={`z-[1] rounded-lg w-auto lg:max-h-[700px] duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <img
          src={image.link}
          className={`absolute w-full opacity-50 object-cover blur-md duration-150`}
        />
      </div>
    </>
  )
}

function PostGallery({ attachments }: { attachments: AttachmentResponse[] }) {
  const [imageIndex, setImageIndex] = useState(0)

  function slide(direction: 'left' | 'right') {
    const range = attachments.length - 1

    let next = imageIndex

    if (direction === 'left') {
      next--
    } else {
      next++
    }

    if (next > range) {
      next = 0
    }

    if (next < 0) {
      next = range
    }

    setImageIndex(next)
  }

  return (
    <div>
      <div className="grid gap-4">
        <div className="flex flex-row justify-center aspect-auto h-[calc(100vh_-_300px)] max-h-[700px] relative rounded-lg overflow-hidden">
          {attachments.length > 1 && (
            <>
              <Button
                size="icon"
                variant="outline"
                className="absolute left-0 lg:left-5 z-[5] top-[calc(50%_-_20px)] cursor-pointer"
                onClick={() => slide('left')}
              >
                <ArrowLeft />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="absolute right-0 lg:right-5 z-[5] top-[calc(50%_-_20px)] cursor-pointer"
                onClick={() => slide('right')}
              >
                <ArrowRight />
              </Button>
            </>
          )}

          {attachments.map((attachment, index) => (
            <div
              key={`principal_${attachment.id}_${index}`}
              className={`w-full absolute ${index === imageIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <PostImage key={`principal_${attachment.id}_${index}`} image={attachment} />
            </div>
          ))}
        </div>
        {attachments.length > 1 && (
          <div className="flex flex-row gap-4 h-36 w-full overflow-hidden overflow-x-scroll">
            {attachments.map((attachment, index) => (
              <div
                className={`relative overflow-hidden h-36 w-36 rounded-md border ${index === imageIndex && 'border-gray-200'}`}
                key={`${attachment.id}_${index}`}
              >
                <img
                  className="h-auto max-w-full hover:opacity-50 duration-700"
                  src={attachment.link}
                  alt={attachment.metadata.filename}
                  onClick={() => setImageIndex(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PostCard({
  post,
  user,
  actions = true,
  redirect = false,
}: {
  post: PostResponse
  user: {
    [x: string]: any
  } | null
  actions?: boolean
  redirect?: boolean
}) {
  const displayActions = useMemo(() => actions && post.user.id === user?.id, [user])

  return (
    <article className="flex flex-col w-full border pt-6 px-6 bg-white rounded-sm">
      <div className="flex flex-row justify-between border-b border-b-gray-200">
        <Link href={userLink(post.user.id)}>
          <div className="flex flex-row gap-3 pb-4 justify-items-center align-middle">
            <Avatar className="h-8 w-8">
              <AvatarImage src="#" alt={`${post.user.name} avatar image`} />
              <AvatarFallback>{post.user.name ? post.user.name[0] : '-'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-600 self-center text-ellipsis truncate max-w-40 md:max-w-screen-lg">
                @{post.user.username}
              </p>
              <span className="flex text-xs text-gray-400 gap-1 items-center">
                <Clock size={10} />
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </span>
            </div>
          </div>
        </Link>

        {displayActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="trigger-user-post-actions" variant="outline" size="sm-icon">
                <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex flex-row gap-4 p-0 text-gray-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  <UpdatePost
                    post={post}
                    trigger={
                      <div className="flex flex-row gap-3 items-center w-full hover:cursor-pointer">
                        <Button className="update-post-trigger" variant="ghost" size="sm-icon">
                          <Pencil size={15} />
                        </Button>
                        <p className="font-normal text-xs text-current">Update</p>
                      </div>
                    }
                  />
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex flex-row gap-4 p-0 text-gray-600 hover:text-red-600"
                onSelect={(e) => e.preventDefault()}
              >
                <DeletePost
                  post={post}
                  trigger={
                    <div className="flex flex-row gap-3 items-center w-full hover:cursor-pointer">
                      <Button className="delete-post-trigger" variant="ghost" size="sm-icon">
                        <Trash2 size={15} />
                      </Button>
                      <p className="font-normal text-xs text-current">Delete</p>
                    </div>
                  }
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex flex-col py-4 gap-4">
        {post.attachments.images.length > 0 && (
          <PostGallery attachments={post.attachments.images} />
        )}

        {redirect ? (
          <Link href={postLink(post.id)}>
            <PostContentParser post={post} />
          </Link>
        ) : (
          <PostContentParser post={post} />
        )}

        {post.link && <LinkPreview preview={post.link} />}
      </div>

      {/* TODO: FOOTER Reactions, comments, and so on*/}
      <div className="py-4 opacity-70 border-t border-t-gray-200">
        <div className="flex flex-row gap-2 items-center">
          <Button variant="outline" size="sm-icon" className="rounded-full w-auto p-2" disabled>
            <p className="text-xs">React</p>
          </Button>
          <p className="text-xs text-slate-500">0 Reactions</p>
        </div>
      </div>
    </article>
  )
}
