import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { LinkMetadataJSONResponse } from 'app/interfaces/post'
import type { UUID } from 'node:crypto'

export class LinkMetadataJSON {
  // TODO: Could benefit in adding class-validator?
  declare thumbnail: string
  declare title: string
  declare description: string

  constructor(data: LinkMetadataJSONResponse) {
    if (
      typeof data.thumbnail !== 'string' ||
      typeof data.title !== 'string' ||
      typeof data.description !== 'string'
    ) {
      throw new Error('Invalid link json metadata.')
    }

    Object.assign(this, data)
  }
}

export default class LinkMetadata extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare link: string

  @column()
  declare metadata: LinkMetadataJSON

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
