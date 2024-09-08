import { Head } from '@inertiajs/react'
import { CreatePost } from '@/components/posts/create'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock } from 'lucide-react'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type FeedController from '#controllers/feed_controller'

export default function Feed({ posts }: InferPageProps<FeedController, 'index'>) {
  return (
    <>
      <Head title="SocialAdonis | Feed" />
      <div className="flex flex-col gap-2 w-full">
        {posts.data?.map((post) => {
          return (
            <article key={post.id} className="flex flex-col w-full border p-6 bg-white rounded-sm">
              <div className="flex flex-row gap-3 pb-4 justify-items-center align-middle">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt={`${post.user.name} avatar image`} />
                  <AvatarFallback>{post.user.name ? post.user.name[0] : '-'}</AvatarFallback>
                </Avatar>
                <p className="text-xs text-gray-500 self-center">@{post.user.username}</p>
              </div>
              <hr />
              <div className="py-4">{post.content}</div>
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
        })}
        <div className="h-32 w-full bg-red-500">fetch more around here</div>
      </div>

      <div className="flex fixed justify-center w-full bottom-0 py-2 bg-white border">
        <CreatePost />
      </div>
    </>
  )
}
