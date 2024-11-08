import { Clock } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UpdatePost } from '@/components/posts/update'
import { DeletePost } from '@/components/posts/delete'
import { PostResponse } from 'app/interfaces/post'
import { AttachmentResponse } from 'app/interfaces/attachment'
import { formatDistanceToNow } from 'date-fns'
import type { UUID } from 'crypto'

const userLink = (id: UUID) => `/users/${id}`
const postLink = (id: UUID) => `/posts/${id}`

function PostImage({ image }: { image: AttachmentResponse }) {
  return (
    <div className="flex flex-row justify-center aspect-auto h-[calc(100vh_-_300px)] relative rounded-lg overflow-hidden">
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
  const bento = attachments.length > 1

  // TODO: Improve.
  return bento ? (
    <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3">
      <div className="relative bg-red-500 col-span-2">
        <PostImage image={attachments[0]} />
      </div>
      <div className="relative bg-green-500 flex flex-col">
        <div>
          <PostImage image={attachments[1]} />
        </div>
        <div>
          <PostImage image={attachments[1]} />
        </div>
        <div>
          <PostImage image={attachments[1]} />
        </div>
      </div>
    </div>
  ) : (
    <PostImage image={attachments[0]} />
  )
}

export default function PostCard({
  post,
  showActions = false,
}: {
  post: PostResponse
  user: {
    [x: string]: any
  } | null
  showActions?: boolean
}) {
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
            <p className="text-xs text-gray-500 self-center text-ellipsis truncate max-w-60 lg:max-w-screen-lg">
              @{post.user.username}
            </p>
          </div>
        </Link>

        {showActions && (
          <div className="flex flex-row gap-2">
            <Button className="update-post-trigger" variant="outline" size="sm-icon">
              <UpdatePost post={post} />
            </Button>
            <Button className="delete-post-trigger" variant="outline" size="sm-icon">
              <DeletePost post={post} />
            </Button>
          </div>
        )}
      </div>

      <hr />

      <div className="py-4">
        <Link href={postLink(post.id)}>
          {post.attachments.images.length > 0 && (
            <PostGallery attachments={post.attachments.images} />
          )}
          <div className="py-4 post-content">{post.content}</div>
        </Link>
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
