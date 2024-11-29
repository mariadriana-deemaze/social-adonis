import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('user_id');
      table.uuid('user_id').references('users.id').notNullable().onDelete('CASCADE').alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('user_id');
      table.uuid('user_id').references('users.id').notNullable().alter()
    })
  }
}
