import { route } from '@izzyjs/route/client'
import { CreatePost } from '@/components/posts/create'
import FeedList from '@/components/posts/feed_list'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type FeedController from '#controllers/feed_controller'
import HeadOG from '@/components/generic/head_og'

export default function Feed({ posts, user }: InferPageProps<FeedController, 'index'>) {
  return (
    <>
      <HeadOG
        title="Feed"
        description="Discover the best creators on Social Adonis."
        url={route('feed.show').path}
      />
      <FeedList url={route('feed.show').path} currentUser={user} posts={posts} />
      {user && (
        <div className="z-10 fixed left-5 bottom-5">
          <CreatePost />
        </div>
      )}
    </>
  )
}
