import { Link } from '@inertiajs/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock } from 'lucide-react'
import { ModelObject } from '@adonisjs/lucid/types/model'
import type { UUID } from 'crypto'

const userFeedLink = (id: UUID) => `/feed/${id}`
const postLink = (id: UUID) => `/posts/${id}`

export default function PostCard(post: ModelObject) {
    console.log("post ->", post)
  if (!post.id) return <></>
  return (
    <article className="flex flex-col w-full border p-6 bg-white rounded-sm">
      <Link href={userFeedLink(post.user.id)}>
        <div className="flex flex-row gap-3 pb-4 justify-items-center align-middle">
          <Avatar className="h-8 w-8">
            <AvatarImage src="#" alt={`${post.user.name} avatar image`} />
            <AvatarFallback>{post.user.name ? post.user.name[0] : '-'}</AvatarFallback>
          </Avatar>
          <p className="text-xs text-gray-500 self-center">@{post.user.username}</p>
        </div>
      </Link>
      <hr />
      <Link href={postLink(post.id)}>
        <div className="py-4">{post.content}</div>
      </Link>
      <hr />
      <div className="pt-4">
        {post.updatedAt && (
          <span className="flex text-xs text-gray-500 gap-3 items-center">
            <Clock size={12} />
            {new Date(post.updatedAt).toUTCString()}
          </span>
        )}
      </div>
    </article>
  )
}
