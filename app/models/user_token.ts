import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import { UserTokenType } from '#enums/user'
import { createHash, type UUID } from 'node:crypto'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class UserToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare type: UserTokenType

  @column()
  declare userId: UUID

  @column()
  declare token: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime()
  declare expiresAt: DateTime
}

export function generateNewToken(date: DateTime) {
  return createHash('sha256').update(date.toJSDate().toISOString()).digest('hex')
}
