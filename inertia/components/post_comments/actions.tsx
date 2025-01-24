import { ReactElement } from 'react'
import { EllipsisVerticalIcon, Pencil, Trash2 } from 'lucide-react'
import { PostCommentResponse } from '#interfaces/post_comment'
import { DeletePostComment } from '@/components/post_comments/delete'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown_menu'

type PostCommentActions = 'delete' | 'update' // | 'report'

export function PostCommentActions({
  comment,
  abilities,
}: {
  comment: PostCommentResponse
  abilities: Partial<
    Record<
      PostCommentActions,
      {
        onSuccess: () => void
        onError: () => void
        trigger?: () => void
      }
    >
  >
}) {
  const actions: Record<PostCommentActions, () => ReactElement> = {
    delete: () => (
      <DeletePostComment
        comment={comment}
        trigger={
          <div className="flex w-full flex-row items-center gap-3 hover:cursor-pointer">
            <Button
              type="button"
              className="delete-post-comment-trigger"
              variant="ghost"
              size="sm-icon"
            >
              <Trash2 size={15} />
            </Button>
            <p className="text-xs font-normal text-current">Delete</p>
          </div>
        }
        onSuccess={() => abilities.delete?.onSuccess()}
      />
    ),
    update: () => (
      <div
        className="flex w-full flex-row items-center gap-3 hover:cursor-pointer"
        onClick={() => abilities.update?.trigger && abilities.update?.trigger()}
      >
        <Button
          type="button"
          className="update-post-comment-trigger"
          variant="ghost"
          size="sm-icon"
        >
          <Pencil size={15} />
        </Button>
        <p className="text-xs font-normal text-current">Update</p>
      </div>
    ),
  }

  const renderActions =
    Object.entries(actions)
      .map(([action]) => Object.keys(abilities).includes(action as PostCommentActions))
      .filter((permission) => permission === true).length > 0

  if (renderActions) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="trigger-user-post-actions" variant="outline" size="sm-icon">
            <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto" align="end" forceMount>
          {Object.entries(actions).map(([action, Element], index) => {
            if (Object.keys(abilities).includes(action as PostCommentActions)) {
              return (
                <DropdownMenuItem
                  key={`${comment.id}_${action}_${index}`}
                  className="flex flex-row gap-4 p-0 text-gray-600"
                  onSelect={(e) => e.preventDefault()}
                  asChild
                >
                  <Element />
                </DropdownMenuItem>
              )
            }
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  } else {
    return <></>
  }
}
