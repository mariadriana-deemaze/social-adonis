import { ReactElement } from 'react'
import { EllipsisVerticalIcon, Trash2 } from 'lucide-react'
import { PostCommentResponse } from '#interfaces/post_comment'
import { DeletePostComment } from '@/components/post_comments/delete'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown_menu'

type PostCommentActions = 'delete' /* 'update' | 'report' | 'pin' */

export function PostCommentActions({
  comment,
  //setPostState,
  abilities,
}: {
  comment: PostCommentResponse
  //setPostState: Dispatch<SetStateAction<PostCommentResponse>>
  abilities: Partial<Array<PostCommentActions>>
}) {
  const actions: Record<PostCommentActions, () => ReactElement> = {
    // report: () => (),
    delete: () => (
      <DeletePostComment
        comment={comment}
        trigger={
          <div className="flex w-full flex-row items-center gap-3 hover:cursor-pointer">
            <Button type="button" className="delete-post-trigger" variant="ghost" size="sm-icon">
              <Trash2 size={15} />
            </Button>
            <p className="text-xs font-normal text-current">Delete</p>
          </div>
        }
        onSuccess={(deletedComment) => console.log('deleted ->', deletedComment)}
      />
    ),
  }

  const renderActions =
    Object.entries(actions)
      .map(([action]) => abilities.includes(action as PostCommentActions))
      .filter((permission) => permission === false).length === 0

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
            if (abilities.includes(action as PostCommentActions)) {
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
