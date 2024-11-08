import { AttachmentModel, AttachmentProvider, AttachmentType } from '#models/attachment'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attachments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table
        .enu('type', Object.values(AttachmentType), {
          useNative: true,
          enumName: 'attachment_type',
          existingType: false,
        })
        .notNullable()
      table
        .enu('model', Object.values(AttachmentModel), {
          useNative: true,
          enumName: 'attachment_model',
          existingType: false,
        })
        .notNullable()
        .comment(`Points as belongs to other models.`)
      table.uuid('model_id').comment(`Connects to unique identifier of the belonging model.`)
      table.string('external_key').notNullable()
      table.string('provider').defaultTo(AttachmentProvider.S3).notNullable()
      table.jsonb('metadata').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
