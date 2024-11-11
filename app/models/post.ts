import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  beforeUpdate,
  belongsTo,
  column,
  computed,
} from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { UUID } from 'crypto'
import { extractFirstLink, sanitizePostContent } from '#utils/index'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare content: string

  @column()
  declare userId: UUID

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @computed()
  get link(): string | null {
    return extractFirstLink(this.content)
  }

  @beforeSave()
  @beforeUpdate()
  static sanitizeContent(post: Post) {
    post.content = sanitizePostContent(post.content)
  }
}
