import { Head } from '@inertiajs/react'
import { CreatePost } from '@/components/posts/create'
import FeedList from '@/components/posts/feed_list'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type FeedController from '#controllers/feed_controller'

export default function Feed({ posts, user }: InferPageProps<FeedController, 'index'>) {
  return (
    <>
      <Head title="SocialAdonis | Feed" />
      <FeedList url={'/feed'} currentUser={user} posts={posts} />
      <div className="z-10 fixed left-5 bottom-5">
        <CreatePost />
      </div>
    </>
  )
}
