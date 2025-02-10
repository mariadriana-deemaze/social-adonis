import { ReactElement, useState } from 'react'
import { EllipsisVerticalIcon, Pencil, Trash2 } from 'lucide-react'
import { PostCommentResponse } from '#interfaces/post_comment'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown_menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DeletePostComment } from '@/components/post_comments/delete'

type PostCommentActions = 'delete' | 'update' // 'report'

function DeleteDialog({
  comment,
  onSuccess,
}: {
  comment: PostCommentResponse
  onSuccess: () => void
}) {
  return (
    <DialogContent className="default-dialog">
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>This is irreversible.</DialogDescription>
      </DialogHeader>
      <DeletePostComment comment={comment} onSuccess={onSuccess} />
    </DialogContent>
  )
}

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
  const [openModal, setOpenModal] = useState<'delete' | false>(false)

  const actions: Record<PostCommentActions, () => ReactElement> = {
    delete: () => (
      <div
        className="flex w-full flex-row items-center gap-3 hover:cursor-pointer"
        onClick={() => setOpenModal('delete')}
      >
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
      <>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="trigger-user-post-actions" variant="outline" size="sm-icon">
              <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto" align="end">
            {Object.entries(actions).map(([action, Element], index) => {
              if (Object.keys(abilities).includes(action as PostCommentActions)) {
                return (
                  <DropdownMenuItem
                    key={`${comment.id}_${action}_${index}`}
                    className="flex flex-row gap-4 p-0 text-gray-600"
                  >
                    <Element />
                  </DropdownMenuItem>
                )
              }
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog
          open={openModal !== false}
          onOpenChange={(open) => {
            !open && setOpenModal(false)
          }}
        >
          {openModal === 'delete' && (
            <DeleteDialog
              comment={comment}
              onSuccess={() => {
                abilities.delete?.onSuccess()
                setOpenModal(false)
              }}
            />
          )}
        </Dialog>
      </>
    )
  } else {
    return <></>
  }
}
