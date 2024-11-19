import { PaginatedResponse } from '#interfaces/pagination'
import { PostReportResponse } from '#interfaces/post'
import PostReport from '#models/post_report'
import PostsService from '#services/posts_service'
import { UserService } from '#services/user_service'
import { inject } from '@adonisjs/core'
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
