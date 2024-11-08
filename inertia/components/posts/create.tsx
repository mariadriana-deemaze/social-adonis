import { useEffect, useMemo, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
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
import { MAX_POST_CONTENT_SIZE, MIN_POST_CONTENT_SIZE } from '#validators/post'
import { cn } from '@/lib/utils'

export function CreatePost() {
  const [open, setOpen] = useState(false)

  const { errors } = usePage().props

  const { toast } = useToast()

  const { data, setData, post, processing } = useForm({
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, ut reiciendis animi maiores tempora ipsam ab aliquam quia magni unde totam vel id alias incidunt distinctio nemo excepturi necessitatibus laboriosam!',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/posts', {
      preserveState: false,
    })
    setOpen(false)
  }

  const invalidPostContent = useMemo(
    () =>
      data.content.length < MIN_POST_CONTENT_SIZE || data.content.length > MAX_POST_CONTENT_SIZE,
    [data.content.length]
  )

  useEffect(() => {
    if (errors) {
      toast({ title: 'There was an issue with publishing your post.', description: errors.content })
    }
  }, [errors])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500">Create post</Button>
      </DialogTrigger>
      <DialogContent className="default-dialog">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
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
            <span className={cn('text-xs', invalidPostContent ? 'text-red-700' : 'text-gray-500')}>
              {data.content.length}/{MAX_POST_CONTENT_SIZE}
            </span>
          </div>
          <DialogFooter>
            <Button
              loading={processing}
              disabled={invalidPostContent}
              type="submit"
            >
              Publish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
