import { PostStatus } from '#enums/post'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enu('status', Object.values(PostStatus), {
        useNative: true,
        enumName: 'post_status',
        existingType: false,
      }).defaultTo(PostStatus.PUBLISHED).notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => table.dropColumn('status'))
    this.schema.raw('DROP TYPE IF EXISTS "post_status"')
  }
}
