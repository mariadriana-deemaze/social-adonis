import { PostReactionType } from '#enums/post'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_reactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.enu('type', Object.values(PostReactionType)).defaultTo(PostReactionType.LIKE).notNullable()
      table.uuid('user_id').references('users.id').notNullable()
      table.uuid('post_id').references('posts.id').notNullable()
      table.timestamp('created_at', { useTz: false })
      table.timestamp('updated_at', { useTz: false })
      table.unique(['user_id', 'post_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
