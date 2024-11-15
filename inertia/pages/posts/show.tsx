import PostsController from '#controllers/posts_controller'
import PostCard from '@/components/posts/post_card'
import { Button } from '@/components/ui/button'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { MoveLeft } from 'lucide-react'

export default function Show({ post, user }: InferPageProps<PostsController, 'show'>) {
  if (!post) return <>loading...</>
  return (
    <>
      <Head title={`SocialAdonis | Post by @${post.user.username}`} />
      <div className="w-full flex flex-col items-start pb-4">
        <div className="my-6">
          <div
            className="flex flex-row gap-2 items-center cursor-pointer hover:opacity-80 duration-200"
            onClick={() => window.history.back()}
          >
            <Button variant="ghost" size="sm-icon">
              <MoveLeft />
            </Button>
            <p className="text-sm">Go back to feed</p>
          </div>
        </div>
        <PostCard user={user} post={post} />
      </div>
    </>
  )
}
