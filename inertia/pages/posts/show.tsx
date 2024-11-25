import PostsController from '#controllers/posts_controller'
import { PostStatus } from '#enums/post'
import InfoPanel from '@/components/generic/info_panel'
import PostCard from '@/components/posts/post_card'
import { Button } from '@/components/ui/button'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { MoveLeft } from 'lucide-react'

export default function Show({ post, user }: InferPageProps<PostsController, 'show'>) {
  if (!post) return <>loading...</>
  return (
    <>
      <Head title={`Post by @${post.user.username}`} />
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
        <div className="w-full flex flex-col gap-4">
          {post.status === PostStatus.REPORTED && (
            <InfoPanel
              type="error"
              title="Only visible to you"
              description="This post has been marked as reported by the content moderation team, so it's no longer visible to others. Most likely part of the content is in infrigment of the community guidelines. If you feel this to have been unfair assesment, please contact the support team."
              className="w-full"
            />
          )}
          <PostCard user={user} post={post} />
        </div>
      </div>
    </>
  )
}
