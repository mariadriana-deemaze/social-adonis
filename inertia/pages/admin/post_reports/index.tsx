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
import { Head, useForm, router } from '@inertiajs/react'
import { ExternalLink, SlidersVertical, TextSearch } from 'lucide-react'
import { MultiSelect } from '@/components/ui/multi_select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PostCard from '@/components/posts/post_card'
import { UserResponse } from '#interfaces/user'
import { PostReportResponse } from '#interfaces/post'
import { formatDistanceToNow } from 'date-fns'

// FIX-ME: izzy
const pageURL = '/admin/posts/reports'

function Update({
  currentUser,
  report,
  open,
  onOpenChange,
}: {
  currentUser: UserResponse
  report: PostReportResponse
  open: boolean
  onOpenChange: React.Dispatch<SetStateAction<boolean>>
}) {
  const { data, setData, processing, reset } = useForm<{
    status: string
  }>({
    status: report.status,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch(pageURL, {
      method: 'put',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    onOpenChange(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>trigger</DialogTrigger>
      <DialogContent className="default-dialog">
        <DialogHeader>
          <DialogTitle>Manage content</DialogTitle>
          <DialogDescription>Take action on the reported complaint</DialogDescription>
        </DialogHeader>

        <div className="max-w-max">
          <PostCard post={report.post} user={currentUser} actions={false} />
        </div>

        <form
          onSubmit={handleSubmit}
          className={cn(processing ? 'opacity-20 pointer-events-none' : 'opacity-100')}
        >
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="reason" className="text-left">
              Change status
            </Label>
            <Select
              value={data.status}
              onValueChange={(value: string) => setData({ status: value })}
            >
              <SelectTrigger className="select-reason">
                <SelectValue id="status" placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PostReportStatus).map(([reason]) => (
                  <SelectItem
                    key={`post-report-${report.id}-reason-${reason.toLowerCase()}`}
                    id={`reason-${reason.toLowerCase()}`}
                    value={reason}
                  >
                    {reason.toLocaleLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {data.status === PostReportStatus.ACCEPTED && (
              <div className="border border-red-200 bg-red-100 rounded-md py-2 px-4">
                <p className="text-red-500">
                  This action will immediately hide the post from the others users feed.
                </p>
              </div>
            )}

            {data.status === PostReportStatus.REJECTED && (
              <div className="border border-green-200 bg-green-100 rounded-md py-2 px-4">
                <p className="text-green-500">
                  This action will discard the complaint, and notify the reporting user of the
                  decision.
                </p>
              </div>
            )}
          </div>

          <Button
            className="mt-5"
            loading={processing}
            disabled={data.status === report.status}
            type="submit"
          >
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function Index({
  queryParams,
  user,
  reports,
}: InferPageProps<AdminPostReportsController, 'index'>) {
  const [updatingReport, setUpdatingPost] = useState<PostReportResponse | null>(null)
  const [openUpdateReport, setOpenUpdateReport] = useState(false)

  const { data, setData } = useForm<{
    reason: string[]
    status: string[]
  }>({
    reason: queryParams?.reason || [],
    status: queryParams?.status || [],
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    router.get(
      pageURL,
      { status: data.status, reason: data.reason },
      {
        preserveState: false,
      }
    )
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

                <Button type="submit" size="sm" className="self-end justify-end h-10">
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
                <TableHead>Date</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>N. Reports</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <p>No records matching the search criteria.</p>
                  </TableCell>
                </TableRow>
              ) : (
                reports.data.map((report: PostReportResponse) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium max-w-10 truncate">
                      <SlidersVertical
                        size={14}
                        className="text-gray-600"
                        onClick={() => {
                          setUpdatingPost(report)
                          setOpenUpdateReport(true)
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-10 truncate">
                      {formatDistanceToNow(new Date(report.createdAt))} ago
                    </TableCell>
                    <TableCell className="font-medium max-w-10 truncate">
                      {report.user.username}
                    </TableCell>
                    <TableCell className="font-medium w-10">
                      {/* // FIX-ME - izzy */}
                      <a href={`/posts/${report.post.id}`} target="blank">
                        <ExternalLink size={15} className="text-blue-400" />
                      </a>
                    </TableCell>
                    <TableCell className="font-medium max-w-10 truncate">
                      {report.post.reportCount}
                    </TableCell>
                    <TableCell className="font-medium max-w-20 truncate">
                      {report.post.content}
                    </TableCell>
                    <TableCell className="font-medium max-w-20 truncate">{report.reason}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
          <DefaultPaginator
            className="py-2"
            meta={reports.meta}
            baseUrl="/admin/posts/reports" // FIX-ME: izzy
          />
        </Card>

        {updatingReport && (
          <Update
            currentUser={user!}
            open={openUpdateReport}
            onOpenChange={setOpenUpdateReport}
            report={updatingReport}
          />
        )}
      </div>
    </>
  )
}
