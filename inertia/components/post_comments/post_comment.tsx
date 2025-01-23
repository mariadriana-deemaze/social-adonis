import { useState } from 'react'
import { UUID } from 'node:crypto'
import { Reply, Trash2, X } from 'lucide-react'
import { PostCommentResponse } from '#interfaces/post_comment'
import { UserResponse } from '#interfaces/user'
import { UserContentHeader } from '@/components/generic/user_content_header'
import { PostCommentActions } from '@/components/post_comments/actions'
import { CreatePostComment } from '@/components/post_comments/create'
import { Button } from '@/components/ui/button'

export function PostComment({
  currentUser,
  comment,
  loadNestedComments,
  appendComment,
  //deleteComment
}: {
  currentUser: UserResponse | null
  comment: PostCommentResponse
  loadNestedComments: (commentId: UUID) => Promise<void>
  appendComment: (comment: PostCommentResponse) => void
  //deleteComment: (comment: PostCommentResponse) => void
}) {
  const [showReplies, setShowReplies] = useState(false)
  const [isReplying, setIsReplying] = useState(false)

  function onSuccess(newComment: PostCommentResponse) {
    appendComment(newComment)
    setIsReplying(false)
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="relative flex w-full flex-row items-center justify-around gap-4">
          <div className="flex flex-grow">
            <UserContentHeader user={comment.user} createdAt={comment.createdAt} />
          </div>
          <PostCommentActions
            comment={comment}
            //setPostState={setPostState}
            abilities={
              comment.user.id === currentUser?.id && comment.deletedAt === null ? ['delete'] : []
            }
          />
        </div>

        {comment.deletedAt ? (
          <div className="flex flex-row items-center gap-4 rounded-md bg-muted p-4">
            <Trash2 size={12} className="text-gray-600/80" />
            <p className="text-xs text-gray-600/80">Commented deleted by author.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-3">
              <p className="text-sm text-gray-600/80">{comment.content}</p>
            </div>
            <div className="flex flex-row gap-3">
              <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)}>
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
                postId={comment.postId}
                replyToId={comment.id}
                onSuccess={onSuccess}
              />
            )}
          </>
        )}
      </div>

      {comment.repliesCount > 0 && (
        <span
          className="cursor-pointer text-xs font-semibold text-blue-400 underline hover:opacity-70"
          onClick={() => {
            if (comment.replies.length === 0) loadNestedComments(comment.id)
            setShowReplies(!showReplies)
          }}
        >
          {showReplies ? `Hide replies` : `Show other ${comment.repliesCount} replies`}
        </span>
      )}

      {comment?.replies && comment.replies.length > 0 && showReplies && (
        <div className="relative ml-6 mt-2 flex flex-col gap-4">
          <div className="absolute -left-6 -top-2 h-full w-4">
            <div className="relative flex h-[calc(100%_-_10px)] flex-grow rounded-bl-lg border-b-[2px] border-l-[2px] border-muted-foreground/40"></div>
          </div>
          {comment.replies.map((reply) => (
            <PostComment
              key={`reply_${reply.parentId}_${reply.id}`}
              currentUser={currentUser}
              comment={reply}
              loadNestedComments={loadNestedComments}
              appendComment={appendComment}
            />
          ))}
        </div>
      )}
    </>
  )
}
