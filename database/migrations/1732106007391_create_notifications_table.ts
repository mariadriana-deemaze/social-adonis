import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.json('data').notNullable()
      table.uuid('notifiable_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('read_at', { useTz: false })
      table.timestamp('created_at', { useTz: false }).notNullable()
      table.timestamp('updated_at', { useTz: false }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
