import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Post from '#models/post'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { UUID } from 'node:crypto'

export default class PostComment extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @column()
  declare postId: UUID

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: UUID

  @column()
  declare replyId: UUID | null

  @belongsTo(() => PostComment)
  declare replyTo: BelongsTo<typeof PostComment>

  @column({
    serialize(value, _attribute, model) {
      return model.$original['deletedAt'] ? 'Comment deleted.' : value
    },
  })
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
