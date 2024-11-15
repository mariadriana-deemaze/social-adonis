import { FormEvent } from 'react'
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
import { DefaultPaginator } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link, useForm } from '@inertiajs/react'
import { ExternalLink, TextSearch } from 'lucide-react'
import { MultiSelect } from '@/components/ui/multi_select'

// FIX-ME: Stardust
const pageURL = '/admin/posts/reports?page=1'

export default function Index({
  queryParams,
  reports,
}: InferPageProps<AdminPostReportsController, 'index'>) {
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
      </div>
    </>
  )
}
