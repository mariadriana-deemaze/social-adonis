import PostsController from '#controllers/posts_controller'
import PostCard from '@/components/posts/post-card'
import { InferPageProps } from '@adonisjs/inertia/types'
import { MoveLeft } from 'lucide-react'

export default function Show({ post, user }: InferPageProps<PostsController, 'show'>) {
  if (!post.id) return <>loading...</>
  return (
    <div>
      <div className="my-6">
        <div className="flex flex-row gap-2" onClick={() => window.history.back()}>
          <MoveLeft />
          Go back to feed
        </div>
      </div>
      <PostCard user={user} post={post} />
    </div>
  )
}
