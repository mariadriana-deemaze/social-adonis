import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'update_attachment_types'

  async up() {
    //this.schema.raw('UPDATE TYPE IF EXISTS "attachment_type"')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
