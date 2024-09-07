import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  async up() {
    this.schema.dropTable('auth_access_tokens')

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('session_token').unique()
      table.string('ip_address').notNullable()
      table.text('user_agent').notNullable()
      table.timestamp('last_active_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
