import { PostReportStatus } from '#enums/post'
import { PaginatedResponse } from '#interfaces/pagination'
import { PostReportResponse } from '#interfaces/post'
import PostReport from '#models/post_report'
import User from '#models/user'
import PostReportingUserStatusNotification from '#notifications/post_reporting_user_status_notification'
import UserPostReportedNotification from '#notifications/user_post_reported_notification'
import PostsService from '#services/posts_service'
import { UserService } from '#services/user_service'
import { adminUpdatePostReportValidator } from '#validators/post_report'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { UUID } from 'node:crypto'

@inject()
export default class AdminPostReportService {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostsService
  ) {}

  async index(
    currentUserId: UUID,
    filters: Record<'reason' | 'status', string[] | null>,
    currentPage: number
  ): Promise<PaginatedResponse<PostReportResponse>> {
    let query = PostReport.query()
      .orderBy('updated_at', 'desc')
      .preload('post', (post) => {
        post.preload('user')
        post.withCount('reports', (q) => q.as('reportsCount'))
      })
      .preload('user')

    if (filters.reason) {
      query.whereIn('reason', filters.reason)
    }

    if (filters.status) {
      query.whereIn('status', filters.status)
    }

    const result = await query.paginate(currentPage, 10)

    const { meta } = result.toJSON()

    const serialized = []
    for (const record of result) {
      const resource = await this.serialize(currentUserId, record)
      serialized.push(resource)
    }

    return {
      data: serialized,
      meta,
    }
  }

  async update(report: PostReport, payload: Record<string, string>) {
    const data = await adminUpdatePostReportValidator.validate(payload)
    report.status = data.status
    await report.save()
    await this.notify(report)
  }

  /**
   * This action performs two notification types:
   * 1 - Notify the post author of the post being blocked, in case it is blocked.
   * 2 - Notify the post reporting user of the taken action.
   */
  private async notify(report: PostReport): Promise<void> {
    await report.load('post')
    const reportingUser = await User.find(report.userId)
    const postAuthor = await User.find(report.post.userId)

    if (!reportingUser || !postAuthor) {
      logger.error('Error in sending the report notifications.')
      return
    }

    try {
      const promises = [reportingUser.notify(new PostReportingUserStatusNotification(report))]

      if (report.status === PostReportStatus.ACCEPTED) {
        promises.push(postAuthor.notify(new UserPostReportedNotification(report)))
      }

      await Promise.all(promises)
    } catch (error) {
      logger.error(`Error in notifying users: ${JSON.stringify(error, null, 2)}`)
    }
  }

  private async serialize(currentUserId: UUID, report: PostReport): Promise<PostReportResponse> {
    const user = await this.userService.serialize(report.user)
    const post = await this.postService.serialize(currentUserId, report.post)
    const data = report.toJSON()

    const resource: PostReportResponse = {
      id: report.id,
      postId: data.postId,
      userId: data.userId,
      reason: data.reason,
      status: data.status,
      description: data.description,
      post: { ...post, reportCount: report.post.$extras.reportsCount },
      user,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    }
    return resource
  }
}
