import { Head } from '@inertiajs/react'
import { CreatePost } from '@/components/posts/create'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type FeedController from '#controllers/feed_controller'
import FeedList from '@/components/posts/feed-list'

export default function Feed({ posts, user }: InferPageProps<FeedController, 'index'>) {
  return (
    <>
      <Head title="SocialAdonis | Feed" />
      <FeedList url={'/feed'} currentUser={user} posts={posts} />
      <div className="z-10 flex fixed justify-center w-full bottom-0 py-2 bg-white border">
        <CreatePost />
      </div>
    </>
  )
}
