import { useEffect, useMemo, useState } from 'react'
import { router } from '@inertiajs/react'
import { useToast } from '@/components/ui/use-toast'
import PostCard from '@/components/posts/post-card'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Loader2 } from 'lucide-react'
import { PostResponse } from 'app/interfaces/post'

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
  currentUser: {
    [x: string]: any
  } | null
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
        <Loader2 className="h-5 w-5 mr-2 animate-spin text-muted" />
      ) : (
        allPosts?.map((post, index) => (
          <PostCard key={index} user={currentUser} post={post} redirect />
        ))
      )}
      <div className="flex justify-center py-5 w-full min-w-full">
        {posts?.data?.length > 0 ? (
          <>
            {hasMorePosts ? (
              <p ref={ref} className="text-sm text-gray-600 self-center cursor-pointer">
                fetch more around here
              </p>
            ) : (
              <p className="text-sm text-gray-600 self-center">Go touch grass outside.</p>
            )}
          </>
        ) : (
          <div className="flex w-full hn-screen items-center justify-center">
            <p className="text-sm text-gray-600 self-center">Nothing to see here. 🍃</p>
          </div>
        )}
      </div>
    </div>
  )
}
