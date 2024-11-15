import PostReport from '#models/post_report'

export default class AdminPostReportService {
  async index(filters: Record<'reason' | 'status', string[] | null>, currentPage: number) {
    let query = PostReport.query().orderBy('updated_at', 'desc').preload('post').preload('user')

    if (filters.reason) {
      query.whereIn('reason', filters.reason)
    }

    if (filters.status) {
      query.whereIn('status', filters.status)
    }

    return await query.paginate(currentPage, 8)
  }
}
