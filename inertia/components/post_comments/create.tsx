import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { Send } from 'lucide-react'
import { PostCommentResponse } from '#interfaces/post_comment'
import {
  MAX_POST_COMMENT_CONTENT_SIZE,
  MIN_POST_COMMENT_CONTENT_SIZE,
} from '#validators/post_comment'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use_toast'
import { cn } from '@/lib/utils'
import { useForm } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'
import type { UUID } from 'node:crypto'

export function CreatePostComment({
  postId,
  replyToId,
  onSuccess,
}: {
  postId: UUID
  onSuccess: (comment: PostCommentResponse) => void
  replyToId?: UUID
}) {
  const [focused, setFocused] = useState(false)

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const { toast } = useToast()

  const { data, setData, processing, reset } = useForm({
    content: '',
  })

  const invalidPostCommentContent = useMemo(
    () =>
      data.content.length < MIN_POST_COMMENT_CONTENT_SIZE ||
      data.content.length > MAX_POST_COMMENT_CONTENT_SIZE,
    [data.content.length]
  )

  const commentPost = async (e: FormEvent) => {
    e.preventDefault()

    const request = await axios.post<PostCommentResponse>(
      route('posts_comments.store', {
        params: {
          postId: postId,
        },
      }).path,
      {
        content: data.content,
        parentId: replyToId || null,
      }
    )

    if (request.status === 201) {
      onSuccess(request.data)
      reset()
    } else {
      toast({
        title: 'Error',
        description: 'Error commenting',
      })
    }
  }

  // We are only focusing on the input for adding replies on the mount cycle
  useEffect(() => {
    if (replyToId) {
      textAreaRef.current?.focus()
    }
  }, [])

  return (
    <form className="relative" onSubmit={commentPost}>
      <Textarea
        ref={textAreaRef}
        value={data.content}
        onChange={(e) => setData('content', e.target.value)}
        placeholder="Write a comment here..."
        className={cn(
          focused ? 'h-24' : 'h-10',
          'mb-4 min-h-10 text-sm transition-all duration-700 ease-in-out'
        )}
        rows={focused ? 10 : 2}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={processing}
      />
      {data.content.length > 0 && (
        <span
          className={cn(
            'absolute -bottom-2 text-xs',
            invalidPostCommentContent ? 'text-red-700' : 'text-gray-500'
          )}
        >
          {data.content.length}/{MAX_POST_COMMENT_CONTENT_SIZE}
        </span>
      )}
      <button
        className={'absolute bottom-6 right-3 disabled:cursor-not-allowed disabled:opacity-35'}
        type="submit"
        disabled={invalidPostCommentContent || processing}
      >
        <Send size={20} className="cursor-pointer text-blue-500 hover:brightness-200" />
      </button>
    </form>
  )
}
