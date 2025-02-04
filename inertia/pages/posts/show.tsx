import PostsController from '#controllers/posts_controller'
import { PostStatus } from '#enums/post'
import HeadOG from '@/components/generic/head_og'
import InfoPanel from '@/components/generic/info_panel'
import PostCard from '@/components/posts/post_card'
import { Button } from '@/components/ui/button'
import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'
import { MoveLeft } from 'lucide-react'

export default function Show({ post, user }: InferPageProps<PostsController, 'show'>) {
  if (!post) return <>loading...</>
  return (
    <>
      <HeadOG
        title={`Post by @${post.user.username}`}
        description={post.content}
        url={route('posts.show', { params: { id: post.id } }).path}
      />
      <div className="flex w-full flex-col items-start pb-4">
        <div className="my-6">
          <div
            className="flex cursor-pointer flex-row items-center gap-2 duration-200 hover:opacity-80"
            onClick={() => router.visit(route('feed.show').path)}
          >
            <Button variant="ghost" size="sm-icon">
              <MoveLeft />
            </Button>
            <p className="text-sm">Go back to feed</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
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
