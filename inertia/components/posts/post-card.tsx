import { useEffect } from 'react'
import { Clock, EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import type { UUID } from 'crypto'
import { Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ModelObject } from '@adonisjs/lucid/types/model'

const userFeedLink = (id: UUID) => `/feed/${id}`
const postLink = (id: UUID) => `/posts/${id}`

export default function PostCard({
  post,
  user,
}: {
  post: ModelObject
  user: {
    [x: string]: any
  } | null
}) {
  async function editPost(): Promise<void> {
    router.patch(`/posts/${post.id}`, {
      set: {
        content: 'Updating post!!',
      },
    })
  }

  async function deletePost(): Promise<void> {
    router.delete(`/posts/${post.id}`, {
      onFinish: () => {
        router.visit('/feed', {
          preserveState: false,
        })
      },
    })
  }

  useEffect(() => {}, [post])

  return (
    <article className="flex flex-col w-full border pt-6 px-6 bg-white rounded-sm">
      {/* HEADER */}
      <div className="flex flex-row justify-between">
        <Link href={userFeedLink(post.user.id)}>
          <div className="flex flex-row gap-3 pb-4 justify-items-center align-middle">
            <Avatar className="h-8 w-8">
              <AvatarImage src="#" alt={`${post.user.name} avatar image`} />
              <AvatarFallback>{post.user.name ? post.user.name[0] : '-'}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-gray-500 self-center">@{post.user.username}</p>
          </div>
        </Link>

        {post.user.id === user?.id && (
          <Button variant="outline" size="icon">
            {/*  <EllipsisVertical className="h-3 w-3" /> */}
            {/* <Trash2 className="text-red-500" onClick={deletePost} /> */}
            <Pencil className="text-blue-500" onClick={editPost} />
          </Button>
        )}
      </div>

      <hr />

      <div className="py-4">
        {/* CONTENT */}
        <Link href={postLink(post.id)}>
          {/* GALLERY CONTAINER */}
          <div className="flex flex-row justify-center aspect-auto h-[calc(100vh_-_300px)] relative rounded-lg overflow-hidden">
            <img
              // Landscape
              // src="https://images.unsplash.com/photo-1632283875841-9258f69d4a22?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8"
              // Portrait
              src="https://plus.unsplash.com/premium_photo-1715030289409-5e81652149e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8"
              className="z-[1] rounded-lg max-w-full"
            />

            {/* // FALLBACK */}
            <img
              src="https://plus.unsplash.com/premium_photo-1715030289409-5e81652149e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8"
              className="absolute w-full blur-md opacity-50"
            />
          </div>

          <div className="py-4">{post.content}</div>
        </Link>
      </div>

      {/* FOOTER */}
      <div className="py-4 opacity-70">
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
