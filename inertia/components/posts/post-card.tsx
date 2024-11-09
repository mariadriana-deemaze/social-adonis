import { Clock, Link as LinkIcon } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UpdatePost } from '@/components/posts/update'
import { DeletePost } from '@/components/posts/delete'
import { formatDistanceToNow } from 'date-fns'
import { PostResponse } from 'app/interfaces/post'
import type { UUID } from 'crypto'

const userLink = (id: UUID) => `/users/${id}`
const postLink = (id: UUID) => `/posts/${id}`

function LinkPreview({ preview }: { preview: NonNullable<PostResponse['link']> }) {
  return (
    <div className="flex flex-col lg:flex-row gap-2 h-96 lg:h-48 w-full max-w-[600px] bg-slate-100 hover:bg-slate-200 duration-500 border border-slate-200 p-3 rounded-md">
      <div className="flex-shrink-0 relative block w-40 h-40 rounded-md overflow-hidden">
        <img
          className="absolute h-full w-full"
          src={preview.metadata.thumbnail}
          alt={preview.metadata.description}
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
            {preview.link}
            <span className="relative">
              <LinkIcon className="h-3" />
            </span>
          </a>
        </div>
        <p className="text-sm truncate text-wrap">{preview.metadata.description}</p>
      </div>
    </div>
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
        {/* CONTENT */}

        {/* GALLERY CONTAINER */}
        <div className="flex flex-row justify-center aspect-auto h-[calc(100vh_-_300px)] relative rounded-lg overflow-hidden">
          <img
            // Landscape
            // src="https://images.unsplash.com/photo-1632283875841-9258f69d4a22?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8"
            // Portrait
            src="https://plus.unsplash.com/premium_photo-1715030289409-5e81652149e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8"
            className="z-[1] rounded-lg max-w-full"
          />

          {/* // BG BACKDROP */}
          <img
            src="https://plus.unsplash.com/premium_photo-1715030289409-5e81652149e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8"
            className="absolute w-full blur-md opacity-50"
          />
        </div>
        
        <Link href={postLink(post.id)}>
          <div className="py-4 post-content">{post.content}</div>
        </Link>
        
        {post.link && <LinkPreview preview={post.link} />}
      
      </div>

      {/* FOOTER */}
      <div className="py-4 opacity-70">
        {post.updatedAt && (
          <span className="flex text-xs text-gray-500 gap-3 items-center">
            <Clock size={12} />
            {formatDistanceToNow(
              //new Date(2014, 6, 2)
              new Date(post.createdAt)
            )}{' '}
            ago
          </span>
        )}
      </div>
    </article>
  )
}
