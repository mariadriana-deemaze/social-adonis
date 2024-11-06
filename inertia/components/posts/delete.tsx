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
import { useToast } from '@/components/ui/use-toast'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { router } from '@inertiajs/react'
import { Trash2 } from 'lucide-react'

export function DeletePost({ post }: { post: ModelObject }) {
  const [open, setOpen] = useState(false)

  const { toast } = useToast()

  const { errors, hasErrors, processing } = useForm()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.delete(`/posts/${post.id}`, {
      onFinish: () => {
        router.visit('/feed', {
          preserveState: false,
        })
      },
    })
    setOpen(false)
  }

  useEffect(() => {
    if (hasErrors) {
      toast({ title: 'There was an issue with deleting your post.' })
    }
  }, [errors])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="text-red-500 h-5" />
      </DialogTrigger>
      <DialogContent className="default-dialog">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This is irreversible.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogFooter>
            <Button className="bg-red-700" loading={processing} type="submit">
              Delete post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
