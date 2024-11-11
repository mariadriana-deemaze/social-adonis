import { ReactNode, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Form from '@/components/posts/form'
import { PostResponse } from 'app/interfaces/post'

export function UpdatePost({ post, trigger }: { post: PostResponse; trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="default-dialog">
        <DialogHeader>
          <DialogTitle>Update post</DialogTitle>
          <DialogDescription>Be creative I guess</DialogDescription>
        </DialogHeader>
        <Form setOpen={setOpen} post={post} />
      </DialogContent>
    </Dialog>
  )
}
