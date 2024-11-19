import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_reports'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('post_id');
      table.uuid('post_id').references('posts.id').notNullable().onDelete('CASCADE').alter()
      table.unique(['user_id', 'post_id'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('post_id');
      table.uuid('post_id').references('posts.id').notNullable().alter()
      table.dropUnique(['user_id', 'post_id'])
    })
  }
}
