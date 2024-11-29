import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { UUID } from 'node:crypto'

export default class UserFollower extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare userId: UUID

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare followerId: UUID

  @belongsTo(() => User)
  declare follower: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
