import { useEffect, useState } from 'react'
import { useForm, router, usePage } from '@inertiajs/react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export function CreatePost() {
  const [open, setOpen] = useState(false)

  const { toast } = useToast()

  const { data, setData, post, errors, hasErrors } = useForm({
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, ut reiciendis animi maiores tempora ipsam ab aliquam quia magni unde totam vel id alias incidunt distinctio nemo excepturi necessitatibus laboriosam!',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/posts')
    setOpen(false)
  }

  useEffect(() => {
    if (hasErrors) {
      toast({ title: 'There was an issue with publishing your post.', description: errors.content })
    }
  }, [errors])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
          <DialogDescription>Be creative I guess</DialogDescription>
        </DialogHeader>
        <form className="container" onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Input
                id="content"
                value={data.content}
                onChange={(e) => setData('content', e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Publish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
