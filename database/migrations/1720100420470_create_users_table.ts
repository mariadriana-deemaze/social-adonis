import { AccountRole } from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .knexQuery

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('name').nullable()
      table.string('surname').nullable()
      table.string('email', 254).notNullable().unique()
      table
        .enum('role', Object.values(AccountRole))
        .defaultTo(AccountRole.USER)
        .notNullable()
        .comment(
          ` Role of the user account within the platform. 
            Registration is for now done the same way, and to attribute an higher role rank 
            is done directly on the DB - at least for the time being.`
        )
      table.string('password').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
