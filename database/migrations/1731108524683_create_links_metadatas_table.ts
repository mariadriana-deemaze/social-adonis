import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'link_metadata'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('link').unique().notNullable()
      table.jsonb('metadata').notNullable()
      table.timestamp('created_at', { useTz: false })
      table.timestamp('updated_at', { useTz: false })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
