import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Clock, Link as LinkIcon, EllipsisVerticalIcon } from 'lucide-react'
import { Link } from '@inertiajs/react'
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
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'
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
  return (
    <div className="flex flex-row justify-center aspect-auto min-h-[calc(100vh_-_300px)] relative rounded-lg overflow-hidden">
      <div className="absolute top-4 left-4 bg-gray-800">
        {/* ON HOVER */}
        {/* {Object.entries(image.metadata).map(([attribute, value]) => (
  <p key={`${image.id}_${attribute}`} className="text-white min-w-20 text-wrap">
    {value}
  </p>
))} */}
      </div>
      <img src={image.link} className="z-[1] rounded-lg max-w-full" />
      <img src={image.link} className="absolute w-full blur-md opacity-50" />
    </div>
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
      {attachments.length > 1 ? (
        <div className="grid gap-4">
          <div className="flex flex-row justify-center aspect-auto h-[calc(100vh_-_300px)] relative rounded-lg overflow-hidden">
            <Button
              size="icon"
              variant="outline"
              className="absolute left-0 lg:left-5 z-[5] top-[calc(50vh_-_170px)]"
              onClick={() => slide('left')}
            >
              <ArrowLeft />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-0 lg:right-5 z-[5] top-[calc(50vh_-_170px)]"
              onClick={() => slide('right')}
            >
              <ArrowRight />
            </Button>
            {attachments.map((attachment, index) => (
              <div
                key={`principal_${attachment.id}_${index}`}
                className={`w-full absolute ${index === imageIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <PostImage key={`principal_${attachment.id}_${index}`} image={attachment} />
              </div>
            ))}
          </div>
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
        </div>
      ) : (
        <PostImage image={attachments[0]} />
      )}
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
      {/* HEADER */}
      <div className="flex flex-row justify-between">
        <Link href={userLink(post.user.id)}>
          <div className="flex flex-row gap-3 pb-4 justify-items-center align-middle">
            <Avatar className="h-8 w-8">
              <AvatarImage src="#" alt={`${post.user.name} avatar image`} />
              <AvatarFallback>{post.user.name ? post.user.name[0] : '-'}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-gray-500 self-center text-ellipsis truncate max-w-40 md:max-w-screen-lg">
              @{post.user.username}
            </p>
          </div>
        </Link>

        {displayActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm-icon">
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex flex-row gap-4"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Button className="update-post-trigger" variant="ghost" size="sm-icon">
                    <UpdatePost post={post} />
                  </Button>
                  <DropdownMenuLabel className="font-normal">Update</DropdownMenuLabel>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex flex-row gap-4"
                onSelect={(e) => e.preventDefault()}
              >
                <Button className="delete-post-trigger" variant="ghost" size="sm-icon">
                  <DeletePost post={post} />
                </Button>
                <DropdownMenuLabel className="font-normal">Delete</DropdownMenuLabel>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <hr />

      <div className="py-4">
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

      {/* FOOTER */}
      <div className="py-4 opacity-70">
        {post.updatedAt && (
          <span className="flex text-xs text-gray-500 gap-3 items-center">
            <Clock size={12} />
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </span>
        )}
      </div>
    </article>
  )
}
