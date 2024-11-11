import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  beforeUpdate,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { UUID } from 'crypto'
import { extractFirstLink, sanitizePostContent } from '#utils/index'
import PostReaction from '#models/post_reaction'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare content: string

  @column()
  declare userId: UUID

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => PostReaction)
  declare reactions: HasMany<typeof PostReaction>

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
