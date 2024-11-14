import { ReactNode, useEffect, useState } from 'react'
import { PostResponse } from '#interfaces/post'
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
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PostReportReason } from '#enums/post'
import { Send } from 'lucide-react'

export function ReportPost({ post, trigger }: { post: PostResponse; trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({
    reason: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [hasReported, setHasReported] = useState<
    | {
        id: string
        reason: string
        description: string
      }
    | undefined
  >(undefined)

  const { toast } = useToast()

  async function getUserPostReport() {
    fetch(`/posts/${post.id}/report`, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        if (json) {
          setHasReported({
            id: json.id,
            reason: json.reason,
            description: json.description,
          })
          setData({
            reason: json.reason,
            description: json.description,
          })
        }
      })
  }

  async function handleSubmit(e: React.FormEvent) {
    const url = hasReported ? `/posts/${hasReported.id}/report` : `/posts/${post.id}/report`
    const method = hasReported ? 'put' : 'post'

    e.preventDefault()
    setIsSubmitting(true)
    fetch(url, {
      method,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true)
      })
      .catch(() => {
        toast({ title: 'Something went wrong.', description: 'Try again later.' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  function resetView() {
    setIsSubmitting(false)
    setData({
      reason: '',
      description: '',
    })
    setOpen(false)
    setSubmitted(false)
  }

  async function onOpenChange() {
    if (open) {
      resetView()
    } else {
      setOpen(true)
    }
  }

  useEffect(() => {
    getUserPostReport()
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="default-dialog">
        <DialogHeader>
          <DialogTitle>Report content</DialogTitle>
          <DialogDescription>Help keep our community safe for everyone.</DialogDescription>
        </DialogHeader>
        {!submitted ? (
          <form className="flex flex-col w-full mt-6 gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="reason" className="text-left">
                What's the reason?
              </Label>
              <Select
                value={data.reason}
                onValueChange={(value: string) => {
                  setData((prevState) => {
                    return {
                      ...prevState,
                      reason: value,
                    }
                  })
                }}
              >
                <SelectTrigger className="select-reason">
                  <SelectValue id="reason" placeholder="Choose a reason" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PostReportReason).map(([reason]) => (
                    <SelectItem id={`reason-${reason.toLowerCase()}`} value={reason}>
                      {reason.toLocaleLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="description" className="text-left">
                Briefly provide further details.
              </Label>
              <Textarea
                id="description"
                onChange={(e) => {
                  setData((prevState) => {
                    return {
                      ...prevState,
                      description: e.target.value,
                    }
                  })
                }}
                className="no-scrollbar"
                value={data.description}
              />
            </div>
            <DialogFooter>
              <Button
                className="bg-red-700"
                loading={isSubmitting}
                disabled={data.reason === '' || data.description === ''}
                type="submit"
              >
                {hasReported ? 'Update report' : 'Report post'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <hr />
            <div className="flex flex-col w-full text-center items-center py-5 gap-6">
              <div className="flex flex-col justify-center items-center h-14 w-14 border-l border-b border-l-green-200 border-b-green-200 bg-gradient-to-tr from-green-100 to-transparent rounded-full">
                <Send className="text-green-500" />
              </div>
              <div className="flex flex-col w-full text-center items-center gap-2">
                <h1 className="font-bold">Thank you for reporting</h1>
                <p className="text-sm text-gray-500 max-w-xs">
                  Will be analysed by our moderators, and will notify you as soon as its processed.
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
