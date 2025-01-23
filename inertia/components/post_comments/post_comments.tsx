import { Dispatch, SetStateAction, useState } from 'react'
import axios from 'axios'
import { MetaResponse, PaginatedResponse } from '#interfaces/pagination'
import { PostResponse } from '#interfaces/post'
import { PostCommentResponse } from '#interfaces/post_comment'
import { UserResponse } from '#interfaces/user'
import { CreatePostComment } from '@/components/post_comments/create'
import { PostComment } from '@/components/post_comments/post_comment'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use_toast'
import { route } from '@izzyjs/route/client'

export function PostComments({
  currentUser,
  postState,
  setPostState,
}: {
  currentUser: UserResponse | null
  postState: PostResponse
  setPostState: Dispatch<SetStateAction<PostResponse>>
}) {
  const [meta, setMeta] = useState<MetaResponse>(postState.comments.meta)

  const { toast } = useToast()

  async function loadMoreComments() {
    const request = await axios.get<PaginatedResponse<PostCommentResponse>>(
      route('posts_comments.index', {
        params: {
          postId: postState.id,
        },
      }).path + meta.nextPageUrl
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

      setMeta({ ...request.data.meta })
    } else {
      toast({
        title: 'Error loading comments',
        description: request.statusText,
      })
    }
  }

  const appendRootComment = (comment: PostCommentResponse) => {
    setPostState({
      ...postState,
      comments: {
        ...postState.comments,
        meta: { ...postState.comments.meta, total: postState.comments.meta.total + 1 },
        data: [comment, ...postState.comments.data],
      },
    })
  }

  return (
    <div className="mb-4 flex flex-col gap-8 rounded-md border border-gray-50 bg-gray-100/30 p-2">
      <div className="flex flex-col gap-6 rounded-md">
        <CreatePostComment postId={postState.id} onSuccess={appendRootComment} />
      </div>

      <div className="flex flex-col gap-6 rounded-md">
        {postState.comments.data.length > 0 ? (
          <>
            <ul className="flex flex-col gap-4">
              {postState.comments.data.map((comment) => {
                return (
                  <li key={`root_${comment.id}`} className="relative flex flex-col gap-4">
                    <PostComment currentUser={currentUser} comment={comment} />
                  </li>
                )
              })}
            </ul>

            {postState.comments.totalCount > 2 &&
              postState.comments.data.length < postState.comments.totalCount && (
                <Button variant="secondary" onClick={loadMoreComments}>
                  Load {postState.comments.totalCount - 2} more comments
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
