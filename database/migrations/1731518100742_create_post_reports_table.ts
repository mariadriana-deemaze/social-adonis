import { PostReportReason, PostReportStatus } from '#enums/post'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_reports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.enu('reason', Object.values(PostReportReason), {
        useNative: true,
        enumName: 'post_report_reason',
        existingType: false,
      }).notNullable()
      table.text('description').notNullable()
      table.enu('status', Object.values(PostReportStatus), {
        useNative: true,
        enumName: 'post_report_status',
        existingType: false,
      }).defaultTo(PostReportStatus.PENDING).notNullable()
      table.uuid('user_id').references('users.id').notNullable()
      table.uuid('post_id').references('posts.id').notNullable()
      table.timestamp('created_at', { useTz: false })
      table.timestamp('updated_at', { useTz: false })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "post_report_reason"')
    this.schema.raw('DROP TYPE IF EXISTS "post_report_status"')
  }
}
