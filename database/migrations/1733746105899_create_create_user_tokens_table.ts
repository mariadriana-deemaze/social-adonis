import { UserTokenType } from '#enums/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.uuid('user_id').references('users.id').notNullable()
      table.enu('type', Object.values(UserTokenType), {
        useNative: true,
        enumName: 'user_token_types',
        existingType: false,
      }).defaultTo(UserTokenType.RESET_ACCESS).notNullable()
      table.string('token').notNullable()
      table.timestamp('created_at', { useTz: false }).notNullable()
      table.timestamp('expires_at', { useTz: false }).notNullable().comment('If consulted after this date, it is considered to be an expired record.')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "user_token_types"')
  }
}
