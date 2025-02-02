import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use_toast'
import { route } from '@izzyjs/route/client'
import { PostCommentResponse } from '#interfaces/post_comment'
import axios from 'axios'

export function DeletePostComment({
  comment,
  onSuccess,
}: {
  comment: PostCommentResponse
  onSuccess: (comment: PostCommentResponse) => void
}) {
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
  }

  useEffect(() => {
    if (hasErrors) {
      toast({ title: 'There was an issue with deleting your post comment.' })
    }
  }, [errors])

  return (
    <form onSubmit={handleSubmit}>
      <DialogFooter>
        <Button className="bg-red-700" loading={processing} type="submit">
          Delete comment
        </Button>
      </DialogFooter>
    </form>
  )
}
