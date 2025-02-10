import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.uuid('post_id').references('posts.id').notNullable().onDelete('CASCADE')
      table.uuid('user_id').references('users.id').notNullable().onDelete('CASCADE')
      table.uuid('parent_id').references(this.tableName + '.id').nullable()
      table.string('content')
      table.timestamp('created_at', { useTz: false }).notNullable()
      table.timestamp('updated_at', { useTz: false }).defaultTo(null).nullable()
      table.timestamp('deleted_at', { useTz: false })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
