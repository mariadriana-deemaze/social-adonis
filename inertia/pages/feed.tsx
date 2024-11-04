import { useEffect, useMemo, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { CreatePost } from '@/components/posts/create'
import { useToast } from '@/components/ui/use-toast'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
// import PostCard from '@/components/posts/post-card'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type FeedController from '#controllers/feed_controller'
import { Clock, EllipsisVertical, Loader2 } from 'lucide-react'
import { UUID } from 'crypto'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import PostCard from '@/components/posts/post-card'

const userFeedLink = (id: UUID) => `/feed/${id}`
const postLink = (id: UUID) => `/posts/${id}`

export default function Feed({ posts, user }: InferPageProps<FeedController, 'index'>) {
  const [allPosts, setAllPosts] = useState(posts?.data)
  const [meta, setMeta] = useState(posts.meta)

  const { toast } = useToast()

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  })

  function loadMore() {
    router.get(
      `/feed${meta.nextPageUrl}`,
      {},
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setAllPosts((prev) => [...(prev ?? []), ...posts.data])
          setMeta(posts.meta)
        },
        onError: () => {
          toast({ title: 'Error loading next page.' })
        },
      }
    )
  }

  const hasMorePosts = useMemo(() => !!meta?.nextPageUrl, [meta])

  useEffect(() => {
    if (isIntersecting) loadMore()
  }, [isIntersecting])

  return (
    <>
      <Head title="SocialAdonis | Feed" />
      <div className="feed-list">
        {!allPosts ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin text-muted" />
        ) : (
          allPosts?.map((post, index) => <PostCard user={user} post={post} key={index} />)
        )}
        <div className="flex justify-center py-5">
          {hasMorePosts ? (
            <p ref={ref} className="text-sm text-gray-600 self-center cursor-pointer">
              fetch more around here
            </p>
          ) : (
            <p className="text-sm text-gray-600 self-center">Go touch grass outside.</p>
          )}
        </div>
      </div>

      <div className="z-10 flex fixed justify-center w-full bottom-0 py-2 bg-white border">
        <CreatePost />
      </div>
    </>
  )
}
