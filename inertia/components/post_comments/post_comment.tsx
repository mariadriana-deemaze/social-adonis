import { Dispatch, useState } from 'react'
import { UUID } from 'node:crypto'
import { Reply, Trash2, X } from 'lucide-react'
import { PostCommentResponse } from '#interfaces/post_comment'
import { UserResponse } from '#interfaces/user'
import { UserContentHeader } from '@/components/generic/user_content_header'
import { PostCommentActions } from '@/components/post_comments/actions'
import { CreatePostComment } from '@/components/post_comments/create'
import { Button } from '@/components/ui/button'
import { route } from '@izzyjs/route/client'
import axios from 'axios'
import { useToast } from '@/components/ui/use_toast'
import { router } from '@inertiajs/react'
import { pluralize } from '#utils/pluralize'
import { UpdatePostComment } from '@/components/post_comments/update'

export function PostComment({
  currentUser,
  comment,
  removeRootComment,
  parentState,
  setParentState,
}: {
  currentUser: UserResponse | null
  comment: PostCommentResponse
  removeRootComment?: () => void
  parentState?: PostCommentResponse
  setParentState?: Dispatch<PostCommentResponse>
}) {
  const { toast } = useToast()

  const [commentState, setCommentState] = useState<PostCommentResponse>(comment)
  const [showReplies, setShowReplies] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  async function loadNestedComments(commentId: UUID) {
    const request = await axios.get<PostCommentResponse & { replies: PostCommentResponse[] }>(
      route('posts_comments.show', {
        params: {
          postId: commentState.postId,
          id: commentId,
        },
      }).path
    )

    if (request.status === 200) {
      setCommentState({
        ...commentState,
        replies: request.data.replies,
      })
    } else {
      toast({
        title: 'Error loading comments',
        description: request.statusText,
      })
    }
  }

  const commentAddSuccess = (newComment: PostCommentResponse) => {
    setCommentState({
      ...commentState,
      replies: [...commentState.replies, newComment],
      repliesCount: commentState.repliesCount + 1,
    })
    setIsReplying(false)
    setShowReplies(true)
  }

  const commentRemoveSuccess = (commentToRemove: PostCommentResponse) => {
    if (removeRootComment) {
      removeRootComment()
    } else if (setParentState && parentState) {
      setParentState({
        ...parentState,
        replies: [...parentState.replies].filter((reply) => reply.id !== commentToRemove.id),
        repliesCount: parentState.repliesCount - 1,
      })
    } else {
      // Unexpected
    }
  }

  const commentUpdateSuccess = (updatedComment: PostCommentResponse) => {
    console.log('updated ->', updatedComment)
  }

  const replyToComment = (e: React.MouseEvent) => {
    if (currentUser) {
      setIsReplying(!isReplying)
    } else {
      e.stopPropagation()
      router.visit(route('auth.show').path)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="relative flex w-full flex-row items-center justify-around gap-4">
          <div className="flex flex-grow">
            <UserContentHeader user={commentState.user} createdAt={commentState.createdAt} />
          </div>
          {currentUser && (
            <PostCommentActions
              comment={commentState}
              abilities={{
                ...(commentState.user.id === currentUser.id &&
                  !commentState?.deletedAt && {
                    delete: {
                      onSuccess: () => commentRemoveSuccess(commentState),
                      onError: () =>
                        toast({ title: 'Error', description: 'Error deleting comment' }),
                    },
                    update: {
                      onSuccess: () => {}, //commentUpdateSuccess(commentState),
                      onError: () =>
                        toast({ title: 'Error', description: 'Error updating comment' }),
                      trigger: () => setIsUpdating(!isUpdating),
                    },
                  }),
              }}
            />
          )}
        </div>

        {commentState.deletedAt ? (
          <div className="flex flex-row items-center gap-4 rounded-md bg-muted p-4">
            <Trash2 size={12} className="text-gray-600/80" />
            <p className="text-xs text-gray-600/80">Commented deleted by author.</p>
          </div>
        ) : (
          <>
            {isUpdating ? (
              <UpdatePostComment
                postId={commentState.postId}
                commentId={commentState.id}
                content={commentState.content}
                onSuccess={commentUpdateSuccess}
              />
            ) : (
              <div className="flex flex-row gap-3">
                <p className="text-sm text-gray-600/80">{commentState.content}</p>
              </div>
            )}

            <div className="flex flex-row gap-3">
              <Button variant="ghost" size="sm" onClick={replyToComment}>
                {isReplying ? (
                  <div className="flex flex-row gap-2">
                    <X size={14} className="text-red-600" />
                    <span className="text-xs text-red-600">Cancel</span>
                  </div>
                ) : (
                  <div className="flex flex-row gap-2">
                    <Reply size={14} className="text-blue-400" />
                    <span className="text-xs text-blue-400">Reply</span>
                  </div>
                )}
              </Button>
            </div>
            {isReplying && (
              <CreatePostComment
                postId={commentState.postId}
                replyToId={commentState.id}
                onSuccess={commentAddSuccess}
              />
            )}
          </>
        )}
      </div>

      {commentState.repliesCount > 0 && (
        <span
          className="cursor-pointer text-xs font-semibold text-blue-400 underline hover:opacity-70"
          onClick={() => {
            if (commentState.replies.length === 0) loadNestedComments(commentState.id)
            setShowReplies(!showReplies)
          }}
        >
          {showReplies
            ? `Hide replies`
            : `Show other ${commentState.repliesCount} ${pluralize('reply', commentState.repliesCount)}`}
        </span>
      )}

      {commentState?.replies && commentState.replies.length > 0 && showReplies && (
        <div className="relative ml-6 mt-2 flex flex-col gap-4">
          <div className="absolute -left-6 -top-2 h-full w-4">
            <div className="relative flex h-[calc(100%_-_10px)] flex-grow rounded-bl-lg border-b-[2px] border-l-[2px] border-muted-foreground/40"></div>
          </div>
          {commentState.replies.map((reply) => (
            <PostComment
              key={`reply_${reply.parentId}_${reply.id}`}
              currentUser={currentUser}
              comment={reply}
              parentState={commentState}
              setParentState={setCommentState}
            />
          ))}
        </div>
      )}
    </>
  )
}
