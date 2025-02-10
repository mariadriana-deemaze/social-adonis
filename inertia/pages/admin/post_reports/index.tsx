import { FormEvent, SetStateAction, useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
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
import { Head, useForm, router } from '@inertiajs/react'
import { CheckCheck, ExternalLink, ListTodo, SlidersVertical, TextSearch } from 'lucide-react'
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
import AdminPageHeader from '@/pages/admin/page_header'
import { route } from '@izzyjs/route/client'
import type { InferPageProps } from '@adonisjs/inertia/types'

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
    router.put(
      route('admin_posts_reports.update', {
        params: {
          id: report.id,
        },
      }).path,
      {
        status: data.status,
      },
      {
        replace: false,
        only: ['reports'],
        onFinish: () => {
          onOpenChange(false)
          reset()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>trigger</DialogTrigger>
      <DialogContent className="default-dialog">
        <DialogHeader>
          <DialogTitle>Manage content</DialogTitle>
          <DialogDescription>Take action on the reported complaint</DialogDescription>
        </DialogHeader>

        <hr />

        <div className="w-full pb-4 pt-8">
          <PostCard post={report.post} user={currentUser} actions={false} showComments={false} />
        </div>

        <form
          onSubmit={handleSubmit}
          className={cn(processing ? 'pointer-events-none opacity-20' : 'opacity-100')}
        >
          <div className="flex w-full flex-col gap-2 rounded-md bg-gray-100 p-4">
            <Label htmlFor="reason" className="text-left">
              Change status
            </Label>
            <Select
              value={data.status}
              onValueChange={(value: string) => setData({ status: value })}
            >
              <SelectTrigger className="select-reason bg-white">
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
              <div className="mt-2 rounded-md border border-red-200 bg-red-100 px-4 py-2">
                <p className="text-sm text-red-500">
                  This action will immediately hide the post from the others users feed.
                </p>
              </div>
            )}

            {data.status === PostReportStatus.REJECTED && (
              <div className="mt-2 rounded-md border border-green-200 bg-green-100 px-4 py-2">
                <p className="text-sm text-green-500">
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

  const emptyStateMessage = useMemo(() => {
    if (
      !queryParams?.reason &&
      queryParams?.status?.length === 1 &&
      queryParams?.status[0] === PostReportStatus.PENDING
    ) {
      return 'All done!'
    }
    return 'No records matching the search criteria.'
  }, [queryParams])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    router.get(
      route('admin_posts_reports.index').path,
      {
        status: data.status,
        reason: data.reason,
      },
      {
        only: ['reports', 'queryParams'],
        preserveState: false,
      }
    )
  }

  return (
    <>
      <Head title="Content moderation" />
      <AdminPageHeader
        title="Content Moderation"
        description="Take actionable steps to recent user reported posts."
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex w-full flex-col gap-2 lg:w-96">
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
            <div className="flex w-full flex-col gap-2 lg:w-96">
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

            <Button type="submit" size="sm" className="h-10 justify-end self-end">
              <TextSearch />
            </Button>
          </div>
        </form>
      </AdminPageHeader>

      <div className="container pt-5">
        <Card className="top-2 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-16">
                  <Button type="button" size="sm-icon" variant="ghost">
                    <ListTodo size={14} className="text-gray-600" />
                  </Button>
                </TableHead>
                <TableHead className="max-w-16">Report date</TableHead>
                <TableHead className="max-w-38">Reporting username</TableHead>
                <TableHead className="max-w-24">Post</TableHead>
                <TableHead className="min-w-32">N. Reports</TableHead>
                <TableHead className="max-w-32">Description</TableHead>
                <TableHead className="max-w-32">Reason</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <p>{emptyStateMessage}</p>
                  </TableCell>
                </TableRow>
              ) : (
                reports.data.map((report: PostReportResponse) => (
                  <TableRow key={report.id}>
                    <TableCell className="items-center justify-center truncate align-middle font-medium">
                      {report.status === PostReportStatus.PENDING ? (
                        <Button
                          className="report-update-action-trigger"
                          type="button"
                          size="sm-icon"
                          variant="outline"
                        >
                          <SlidersVertical
                            size={14}
                            className="text-gray-600"
                            onClick={() => {
                              setUpdatingPost(report)
                              setOpenUpdateReport(true)
                            }}
                          />
                        </Button>
                      ) : (
                        <Button disabled={true} type="button" size="sm-icon" variant="ghost">
                          <CheckCheck size={14} className="text-gray-600" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="truncate font-medium">
                      {formatDistanceToNow(new Date(report.createdAt))} ago
                    </TableCell>
                    <TableCell className="truncate font-medium">{report.user.username}</TableCell>
                    <TableCell className="font-medium">
                      <a
                        href={route('posts.show', { params: { id: report.post.id } }).path}
                        target="blank"
                      >
                        <ExternalLink size={15} className="text-blue-400" />
                      </a>
                    </TableCell>
                    <TableCell className="report-count truncate font-medium">
                      {report.post.reportCount}
                    </TableCell>
                    <TableCell className="report-post-content max-w-60 truncate font-medium">
                      {report.post.content}
                    </TableCell>
                    <TableCell className="truncate font-medium">{report.reason}</TableCell>
                    <TableCell className="report-status flex justify-end font-medium">
                      <span
                        className={cn(
                          'w-max rounded-sm px-2 py-1 text-xs font-medium text-white',
                          report.status === PostReportStatus.ACCEPTED && 'bg-green-500',
                          report.status === PostReportStatus.PENDING && 'bg-orange-500',
                          report.status === PostReportStatus.REJECTED && 'bg-red-500'
                        )}
                      >
                        {report.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <DefaultPaginator
            className="py-2"
            meta={reports.meta}
            baseUrl={route('admin_posts_reports.index').path}
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
