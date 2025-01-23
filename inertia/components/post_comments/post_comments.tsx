import { Dispatch, SetStateAction } from 'react'
import axios from 'axios'
import { PaginatedResponse } from '#interfaces/pagination'
import { PostResponse } from '#interfaces/post'
import { PostCommentResponse } from '#interfaces/post_comment'
import { UserResponse } from '#interfaces/user'
import { CreatePostComment } from '@/components/post_comments/create'
import { PostComment } from '@/components/post_comments/post_comment'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use_toast'
import { route } from '@izzyjs/route/client'
import type { UUID } from 'node:crypto'

export function PostComments({
  currentUser,
  postState,
  setPostState,
}: {
  currentUser: UserResponse | null
  postState: PostResponse
  setPostState: Dispatch<SetStateAction<PostResponse>>
}) {
  const { toast } = useToast()

  async function loadMoreComments() {
    const request = await axios.get<PaginatedResponse<PostCommentResponse>>(
      route('posts_comments.index', {
        params: {
          postId: postState.id,
        },
      }).path
    )

    if (request.status === 200) {
      const commentsIds = new Set()
      const updatedComments = [...postState.comments.data, ...request.data.data].filter(
        ({ id }) => !commentsIds.has(id) && commentsIds.add(id)
      )

      setPostState({
        ...postState,
        comments: {
          ...postState.comments,
          data: updatedComments,
        },
      })
    } else {
      toast({
        title: 'Error loading comments',
        description: request.statusText,
      })
    }
  }

  async function loadNestedComments(commentId: UUID) {
    const request = await axios.get<PostCommentResponse & { replies: PostCommentResponse[] }>(
      route('posts_comments.show', {
        params: {
          postId: postState.id,
          id: commentId,
        },
      }).path
    )

    if (request.status === 200) {
      let updatedComments = postState.comments.data
      const parentCommentIndex = postState.comments.data.findIndex(
        (comment) => comment.id === commentId
      )

      if (updatedComments[parentCommentIndex]) {
        updatedComments[parentCommentIndex] = {
          ...updatedComments[parentCommentIndex],
          replies: request.data.replies,
        }
      }

      setPostState({
        ...postState,
        comments: {
          ...postState.comments,
          data: updatedComments,
        },
      })
    } else {
      toast({
        title: 'Error loading comments',
        description: request.statusText,
      })
    }
  }

  function appendComment(comment: PostCommentResponse) {
    const updatedMeta = { ...postState.comments.meta, total: postState.comments.meta.total + 1 }

    if (comment.parentId) {
      let updatedComments = postState.comments.data
      const parentCommentIndex = postState.comments.data.findIndex((c) => c.id === comment.id)

      if (updatedComments[parentCommentIndex]) {
        updatedComments[parentCommentIndex] = {
          ...updatedComments[parentCommentIndex],
          repliesCount: updatedComments[parentCommentIndex].repliesCount + 1,
          replies: [comment, ...updatedComments[parentCommentIndex].replies],
        }
      }

      setPostState({
        ...postState,
        comments: {
          ...postState.comments,
          meta: updatedMeta,
          data: updatedComments,
        },
      })
    } else {
      setPostState({
        ...postState,
        comments: {
          ...postState.comments,
          meta: updatedMeta,
          data: [comment, ...postState.comments.data],
        },
      })
    }
  }

  return (
    <div className="mb-4 flex flex-col gap-8 rounded-md border border-gray-50 bg-gray-100/30 p-2">
      <div className="flex flex-col gap-6 rounded-md">
        <CreatePostComment postId={postState.id} onSuccess={appendComment} />
      </div>

      <div className="flex flex-col gap-6 rounded-md">
        {postState.comments.data.length > 0 ? (
          <>
            <ul className="flex flex-col gap-4">
              {postState.comments.data.map((comment) => {
                return (
                  <li key={`root_${comment.id}`} className="relative flex flex-col gap-4">
                    <PostComment
                      currentUser={currentUser}
                      comment={comment}
                      loadNestedComments={loadNestedComments}
                      appendComment={appendComment}
                    />
                  </li>
                )
              })}
            </ul>
            {postState.comments.meta.total > 2 &&
              postState.comments.data.length < postState.comments.meta.total && (
                <Button variant="secondary" onClick={loadMoreComments}>
                  Load {postState.comments.meta.total - 2} more comments
                </Button>
              )}
          </>
        ) : (
          <div className="w-full text-center">
            <p className="text-xs text-slate-500">No comments yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
