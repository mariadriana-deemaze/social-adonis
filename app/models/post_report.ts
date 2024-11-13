import { DateTime } from 'luxon'
import { BaseModel, beforeUpdate, belongsTo, column } from '@adonisjs/lucid/orm'
import { PostReportReason, PostReportStatus, PostStatus } from '#enums/post'
import User from '#models/user'
import Post from '#models/post'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { UUID } from 'crypto'

export default class PostReport extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare reason: PostReportReason;

  @column()
  declare description: string;

  @column()
  declare userId: UUID;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare postId: UUID;

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @column()
  declare status: PostReportStatus;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeUpdate()
  static async updatePostStatus(report: PostReport) {
    if (report.status === PostReportStatus.ACCEPTED) {
      await report.load('post');
      const post = report.post;
      post.status = PostStatus.REPORTED
      await post.save()
    }
  }
}
