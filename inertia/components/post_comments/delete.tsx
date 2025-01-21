import { ReactNode, useEffect, useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use_toast'
import { route } from '@izzyjs/route/client'
import { PostCommentResponse } from '#interfaces/post_comment'
import axios from 'axios'

export function DeletePostComment({
  comment,
  trigger,
  onSuccess,
}: {
  comment: PostCommentResponse
  trigger: ReactNode
  onSuccess: (comment: PostCommentResponse) => void
}) {
  const [open, setOpen] = useState(false)

  const { toast } = useToast()

  const { errors, hasErrors, processing } = useForm()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    axios
      .delete(
        route('posts_comments.destroy', { params: { id: comment.id, postId: comment.postId } }).path
      )
      .then(() => {
        onSuccess(comment)
      })
      .finally(() => {
        setOpen(false)
      })
  }

  useEffect(() => {
    if (hasErrors) {
      toast({ title: 'There was an issue with deleting your post comment.' })
    }
  }, [errors])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="default-dialog">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This is irreversible.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogFooter>
            <Button className="bg-red-700" loading={processing} type="submit">
              Delete comment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
