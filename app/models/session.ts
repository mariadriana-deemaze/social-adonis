import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { UUID } from 'crypto'

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare userId: string

  @column()
  declare ipAddress: string

  @column()
  declare sessionToken: string

  @column()
  declare userAgent: string

  @column.dateTime({ autoCreate: true })
  declare lastActiveAt: DateTime
}
