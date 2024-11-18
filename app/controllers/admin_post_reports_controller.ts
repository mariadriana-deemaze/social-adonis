import { PageObject } from '@adonisjs/inertia/types'
import { inject } from '@adonisjs/core'
import AdminPostReportService from '#services/admin_post_report_service'
import { PaginatedResponse } from '#interfaces/pagination'
import { PostReportResponse } from '#interfaces/post'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdminPostReportsController {
  constructor(private readonly service: AdminPostReportService) {}

  async index(ctx: HttpContext): Promise<
    | string
    | PageObject<{
        reports: PaginatedResponse<PostReportResponse>
      }>
  > {
    const currentUserId = ctx.auth.user?.id!
    const page = ctx.request.qs().page || 1

    const filters: Record<'reason' | 'status', string[] | null> = {
      reason: ctx.request.qs().reason ? [ctx.request.qs().reason].flat() : null,
      status: ctx.request.qs().status ? [ctx.request.qs().status].flat() : null,
    }

    const reports = await this.service.index(currentUserId, filters, page)

    return ctx.inertia.render('admin/post_reports/index', {
      reports,
    })
  }

  async update(ctx: HttpContext) {
    // TODO: Implement
    return ctx.response.ok('Updated')
  }
}
