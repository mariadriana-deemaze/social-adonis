import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  beforeSave,
  beforeUpdate,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@adonisjs/lucid/orm'
import User from '#models/user'
import { extractFirstLink, sanitizePostContent } from '#utils/index'
import PostReaction from '#models/post_reaction'
import type { UUID } from 'crypto'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare content: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: UUID

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

  @beforeDelete()
  public static async deleteAssociations(post: Post) {
    await post.related('reactions').query().delete()
  }
}
