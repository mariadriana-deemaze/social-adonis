import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { UUID } from 'node:crypto'
import { AttachmentMetadataJSON } from 'app/interfaces/attachment'

export enum AttachmentProvider {
  S3 = 'S3',
}

export enum AttachmentType {
  IMAGE = 'Image',
  AUDIO = 'Audio',
  DOCUMENT = 'Document',
  VIDEO = 'Video',
  AVATAR = 'Avatar',
  COVER = 'Cover',
}

export enum AttachmentModel {
  USER = 'User',
  POST = 'Post',
}

export class MetadataJSON {
  // TODO: Could benefit in adding class-validator?
  declare filename: string
  declare size: number
  declare mimetype: string
  declare extension: string

  constructor(data: AttachmentMetadataJSON) {
    if (
      (!data.filename && typeof data.filename !== 'string') ||
      (!data.size && typeof data.size !== 'number') ||
      (!data.mimetype && typeof data.mimetype !== 'string') ||
      (!data.extension && typeof data.extension !== 'string')
    ) {
      throw new Error('Invalid file.')
    }

    Object.assign(this, data)
  }
}

export default class Attachment extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare type: AttachmentType

  @column()
  declare model: AttachmentModel

  @column()
  declare model_id: UUID

  @column()
  declare external_key: string

  @column()
  provider: AttachmentProvider = AttachmentProvider.S3

  @column({})
  declare metadata: MetadataJSON

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
