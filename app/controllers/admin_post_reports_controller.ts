import { PageObject } from '@adonisjs/inertia/types'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import AdminPostReportService from '#services/admin_post_report_service'
import PostReport from '#models/post_report'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

@inject()
export default class AdminPostReportsController {
  constructor(private readonly service: AdminPostReportService) {}

  async index(ctx: HttpContext): Promise<
    | string
    | PageObject<{
        reports: ModelPaginatorContract<PostReport>
      }>
  > {
    const page = ctx.request.qs().page || 1

    const filters: Record<'reason' | 'status', string[] | null> = {
      reason: ctx.request.qs().reason ? [ctx.request.qs().reason].flat() : null,
      status: ctx.request.qs().status ? [ctx.request.qs().status].flat() : null,
    }

    const reports = await this.service.index(filters, page)
    return ctx.inertia.render('admin/post_reports/index', {
      reports,
    })
  }
}
