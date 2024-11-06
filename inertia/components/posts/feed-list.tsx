import { useEffect, useMemo, useState } from 'react'
import { router } from '@inertiajs/react'
import { useToast } from '@/components/ui/use-toast'
import PostCard from '@/components/posts/post-card'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Loader2 } from 'lucide-react'
import { ModelObject } from '@adonisjs/lucid/types/model'

export default function FeedList({
  url,
  posts,
  currentUser,
}: {
  url: string
  posts: {
    meta: any
    data: ModelObject[]
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
    <div className="feed-list">
      {!allPosts ? (
        <Loader2 className="h-5 w-5 mr-2 animate-spin text-muted" />
      ) : (
        allPosts?.map((post, index) => <PostCard user={currentUser} post={post} key={index} />)
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
  )
}
