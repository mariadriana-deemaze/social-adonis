import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Post from '#models/post'
import User from '#models/user'
import { PostReactionType } from '#enums/post'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { UUID } from 'node:crypto'

export default class PostReaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: UUID

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @column()
  declare postId: UUID

  @column()
  declare type: PostReactionType

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
