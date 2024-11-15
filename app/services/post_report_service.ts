import Post from '#models/post'
import PostReport from '#models/post_report'
import { postReportValidator } from '#validators/post_report'
import { UUID } from 'node:crypto'

export default class PostReportService {
  constructor() {}

  async create(currentUserId: UUID, post: Post, payload: Record<string, any>) {
    const data = await postReportValidator.validate(payload)
    const resource = await PostReport.create({
      ...data,
      userId: currentUserId,
      postId: post.id,
    })
    return resource
  }

  async update(report: PostReport, payload: Record<string, any>) {
    const data = await postReportValidator.validate(payload)
    report.reason = data.reason
    report.description = data.description
    await report.save()
    return report
  }

  async delete(report: PostReport) {
    await report.delete()
  }
}
