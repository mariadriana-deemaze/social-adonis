import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  beforeSave,
  belongsTo,
  column,
  computed,
  hasMany,
  scope,
} from '@adonisjs/lucid/orm'
import User from '#models/user'
import { extractFirstLink, REGEX, sanitizePostContent } from '#utils/index'
import PostComment from '#models/post_comment'
import PostReaction from '#models/post_reaction'
import PostReport from '#models/post_report'
import { PostStatus } from '#enums/post'
import emitter from '@adonisjs/core/services/emitter'
import type { UUID } from 'node:crypto'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Post extends BaseModel {
  static visible = scope((query) => {
    query.where('status', PostStatus.PUBLISHED)
  })

  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare content: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: UUID

  @column()
  declare status: PostStatus

  @column()
  declare pinned: boolean

  @hasMany(() => PostReaction)
  declare reactions: HasMany<typeof PostReaction>

  @hasMany(() => PostComment)
  declare comments: HasMany<typeof PostComment>

  @hasMany(() => PostReport)
  declare reports: HasMany<typeof PostReport>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @computed()
  get link(): string | null {
    return extractFirstLink(this.content)
  }

  @computed()
  get matches(): Map<string, string[]> {
    const mapped = new Map<string, string[]>()
    const possibleMentions =
      this.content.match(new RegExp(REGEX.MENTIONS))?.map((m) => m.replace('@', '')) || []
    mapped.set('@', possibleMentions)
    return mapped
  }

  @beforeSave()
  static sanitizeContent(post: Post) {
    post.content = sanitizePostContent(post.content)
    const mentions = post.matches.get('@')
    // TODO: Future concept
    // const tags = post.matches.get('#')
    if (mentions) emitter.emit('post:mention', [mentions, post])
  }

  @beforeDelete()
  static async deleteAssociations(post: Post) {
    await post.related('reactions').query().delete()
  }
}
