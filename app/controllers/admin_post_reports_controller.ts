import { PageObject } from '@adonisjs/inertia/types'
import { inject } from '@adonisjs/core'
import AdminPostReportService from '#services/admin_post_report_service'
import { PaginatedResponse } from '#interfaces/pagination'
import { PostReportResponse } from '#interfaces/post'
import { adminUpdatePostReportValidator } from '#validators/post_report'
import PostReport from '#models/post_report'
import { errorsReducer } from '#utils/index'
import { errors } from '@vinejs/vine'
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
    const reportId = ctx.request.params().id
    const report = await PostReport.findOrFail(reportId)

    if (await ctx.bouncer.with('PostReportPolicy').denies('edit', report)) {
      return ctx.response.forbidden('Only admin is able to take action on report status.')
    }

    // TODO: Pass to service
    try {
      const payload = ctx.request.body()
      const data = await adminUpdatePostReportValidator.validate(payload)
      report.status = data.status
      await report.save()
      await this.service.notify(report)
      return this.index(ctx)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        return ctx.response.badRequest(reducedErrors)
      }
      return ctx.response.badRequest()
    }
  }
}
