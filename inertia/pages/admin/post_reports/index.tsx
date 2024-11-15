import { FormEvent, SetStateAction, useState } from 'react'
import AdminPostReportsController from '#controllers/admin_post_reports_controller'
import { PostReportReason, PostReportStatus } from '#enums/post'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DefaultPaginator } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { ExternalLink, SlidersVertical, TextSearch } from 'lucide-react'
import { MultiSelect } from '@/components/ui/multi_select'
import { useToast } from '@/components/ui/use_toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ModelObject } from '@adonisjs/lucid/types/model'

// FIX-ME: Stardust
const pageURL = '/admin/posts/reports'

function Update({
  report,
  open,
  onOpenChange,
}: {
  report: ModelObject
  open: boolean
  onOpenChange: React.Dispatch<SetStateAction<boolean>>
}) {
  const { errors } = usePage().props

  const { toast } = useToast()

  const {
    data,
    setData,
    post: postData,
    patch: patchData,
    processing,
  } = useForm<{
    status: string
  }>({
    status: report.status,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    patchData(pageURL, {
      preserveState: false,
      onFinish: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>trigger</DialogTrigger>
      <DialogContent className="default-dialog">
        <DialogHeader>
          <DialogTitle>Manage content</DialogTitle>
          <DialogDescription>Revise</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className={cn(processing ? 'opacity-20 pointer-events-none' : 'opacity-100')}
        >
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="reason" className="text-left">
              What's the reason?
            </Label>
            <Select
              value={data.status}
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

          <Button className="mt-5" loading={processing} disabled={true} type="submit">
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function Index({
  queryParams,
  reports,
}: InferPageProps<AdminPostReportsController, 'index'>) {
  const [updatingReport, setUpdatingPost] = useState(null)
  const [openUpdateReport, setOpenUpdateReport] = useState(false)

  const { data, setData, get } = useForm<{
    reason: string[]
    status: string[]
  }>({
    reason: queryParams.reason || [],
    status: queryParams.status || [],
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // FIX-ME: Figure what's the best pattern here.
    let url = pageURL

    if (data.reason.length > 0) {
      //@ts-ignore
      url += String(data.reason.map((reason) => `&reason[]=${reason}`)).replaceAll(',', '')
    }

    if (data.status.length > 0) {
      //@ts-ignore
      url += String(data.status.map((status) => `&status[]=${status}`)).replaceAll(',', '')
    }

    get(url)
  }

  return (
    <>
      <Head title="Moderation Reports" />
      <div className="flex flex-col justify-start relative lg:h-52 pb-5 text-left w-full border-b border-b-gray-200 bg-gray-100">
        <div className="w-full container items-stretch">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Content Moderation</h2>
            <h2 className="text-sm font-normal text-gray-700">
              Take actionable steps to recent user reported posts
            </h2>
          </div>

          <div className="flex flex-col gap-4 min-h-24 w-full justify-end">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex flex-col gap-2 w-full lg:w-96">
                  <Label htmlFor="reason" className="text-left">
                    Reason:
                  </Label>
                  <MultiSelect
                    id="reason"
                    defaultValue={data.reason}
                    maxCount={1}
                    placeholder="Filter by a reason"
                    className="bg-white"
                    options={Object.values(PostReportReason).map((reason) => {
                      return {
                        label: reason.toLocaleLowerCase(),
                        value: reason,
                      }
                    })}
                    value={data.reason}
                    onValueChange={(value) =>
                      setData((prevState) => {
                        return {
                          ...prevState,
                          reason: value,
                        }
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 w-full lg:w-96">
                  <Label htmlFor="status" className="text-left">
                    Status:
                  </Label>
                  <MultiSelect
                    id="status"
                    defaultValue={data.status}
                    maxCount={1}
                    placeholder="Filter by status"
                    className="bg-white"
                    options={Object.values(PostReportStatus).map((status) => {
                      return {
                        label: status.toLocaleLowerCase(),
                        value: status,
                      }
                    })}
                    value={data.status}
                    onValueChange={(value) =>
                      setData((prevState) => {
                        return {
                          ...prevState,
                          status: value,
                        }
                      })
                    }
                  />
                </div>

                <Button type="submit" size="sm" className="self-end justify-end">
                  <TextSearch />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container pt-5">
        <Card className="w-full top-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SlidersVertical size={14} className="text-gray-600" />
                </TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.data.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium max-w-10 truncate">
                    <SlidersVertical
                      size={14}
                      className="text-gray-600"
                      onClick={() => {
                        setUpdatingPost(report.post)
                        setOpenUpdateReport(true)
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-10 truncate">
                    {report.user.username}
                  </TableCell>
                  <TableCell className="font-medium w-10">
                    <Link href={`/posts/${report.post.id}`}>
                      <ExternalLink size={15} className="text-blue-400" />
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium max-w-20 truncate">
                    {report.post.content}
                  </TableCell>
                  <TableCell className="font-medium max-w-20 truncate">{report.reason}</TableCell>
                  <TableCell className="font-medium max-w-20 truncate">
                    {report.description}
                  </TableCell>
                  <TableCell className="flex font-medium justify-end">
                    <div
                      className={cn(
                        'font-medium text-xs text-white w-max rounded-sm px-2 py-1',
                        report.status === PostReportStatus.ACCEPTED && 'bg-green-500',
                        report.status === PostReportStatus.PENDING && 'bg-orange-500',
                        report.status === PostReportStatus.REJECTED && 'bg-red-500'
                      )}
                    >
                      {report.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DefaultPaginator
            className="mt-5 py-2"
            meta={reports.meta}
            baseUrl="/admin/posts/reports"
          />
        </Card>

        {updatingReport && (
          <Update open={openUpdateReport} onOpenChange={setOpenUpdateReport} report={updatingReport} />
        )}
      </div>
    </>
  )
}
