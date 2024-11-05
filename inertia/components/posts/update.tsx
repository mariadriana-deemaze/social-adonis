import { useEffect, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { MAX_POST_CONTENT_SIZE } from '#validators/post'
import { cn } from '@/lib/utils'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { Pencil } from 'lucide-react'

export function UpdatePost({ post }: { post: ModelObject }) {
  const [open, setOpen] = useState(false)

  const { toast } = useToast()

  const { data, setData, patch, errors, hasErrors, processing } = useForm({
    content: post.content,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    patch(`/posts/${post.id}`, {
      preserveState: false,
    })
    setOpen(false)
  }

  function handleOpenChange(nextState: boolean) {
    if (nextState === false) setData({ content: post.content })
    setOpen(nextState)
  }

  useEffect(() => {
    if (hasErrors) {
      toast({ title: 'There was an issue with updating your post.', description: errors.content })
    }
  }, [errors])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Pencil className="text-blue-500 h-5" />
      </DialogTrigger>
      <DialogContent className="default-dialog">
        <DialogHeader>
          <DialogTitle>Update post</DialogTitle>
          <DialogDescription>Be creative I guess</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col w-full mb-6 gap-2">
            <Label htmlFor="content" className="text-left">
              Post content
            </Label>
            <Textarea
              id="content"
              className="no-scrollbar"
              value={data.content}
              onChange={(e) => setData('content', e.target.value)}
            />
            <span
              className={cn(
                'text-xs',
                data.content.length > MAX_POST_CONTENT_SIZE ? 'text-red-700' : 'text-gray-500'
              )}
            >
              {data.content.length}/{MAX_POST_CONTENT_SIZE}
            </span>
          </div>
          <DialogFooter>
            <Button
              loading={processing}
              disabled={data.content.length > MAX_POST_CONTENT_SIZE}
              type="submit"
            >
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
