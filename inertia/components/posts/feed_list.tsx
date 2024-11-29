import { useEffect, useMemo, useState } from 'react'
import { router } from '@inertiajs/react'
import { useToast } from '@/components/ui/use_toast'
import PostCard from '@/components/posts/post_card'
import { useIntersectionObserver } from '@/hooks/use_intersection_observer'
import { PostResponse } from '#interfaces/post'
import { UserResponse } from '#interfaces/user'
import { Loader2 } from 'lucide-react'

export default function FeedList({
  url,
  posts,
  currentUser,
}: {
  url: string
  posts: {
    meta: any
    data: PostResponse[]
  }
  currentUser: UserResponse | null
}) {
  const [allPosts, setAllPosts] = useState(posts?.data)
  const [meta, setMeta] = useState(posts.meta)

  const { toast } = useToast()

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  })

  function loadMore() {
    router.get(
      `${url}${meta.nextPageUrl}`,
      {},
      {
        only: ['posts'],
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
    <div className="feed-list w-full">
      {!allPosts ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-muted" />
      ) : (
        allPosts?.map((post, index) => (
          <PostCard key={index} user={currentUser} post={post} actions={!!currentUser} redirect />
        ))
      )}
      <div className="flex w-full min-w-full justify-center py-5">
        {posts?.data?.length > 0 ? (
          <>
            {hasMorePosts ? (
              <p ref={ref} className="cursor-pointer self-center text-sm text-gray-600">
                fetch more around here
              </p>
            ) : (
              <p className="self-center text-sm text-gray-600">Go touch grass outside.</p>
            )}
          </>
        ) : (
          <div className="hn-screen flex w-full items-center justify-center">
            <p className="self-center text-sm text-gray-600">Nothing to see here. 🍃</p>
          </div>
        )}
      </div>
    </div>
  )
}
