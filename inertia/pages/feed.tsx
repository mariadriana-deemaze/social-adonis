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
      <div className="flex flex-col gap-2 w-full pb-20 border border-red-700">
        <p>It works!</p>
        {!allPosts ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin text-muted" />
        ) : (
          allPosts?.map((post) => (
            <article className="flex flex-col w-full border p-6 bg-white rounded-sm">
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
                    <EllipsisVertical className="h-3 w-3" />
                  </Button>
                )}
                
              </div>
              <hr />
              <Link href={postLink(post.id)}>
                <div className="py-4">{post.content}</div>
              </Link>
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
          ))
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

      <div className="flex fixed justify-center w-full bottom-0 py-2 bg-white border">
        <CreatePost />
      </div>
    </>
  )
}
