import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('posts', (table) => {
      table.timestamp('created_at', { useTz: false }).alter()
      table.timestamp('updated_at', { useTz: false }).alter()
    })

    await this.db.rawQuery(
      "UPDATE posts SET created_at = created_at AT TIME ZONE 'UTC' + INTERVAL '1 HOUR' * 1, updated_at = updated_at AT TIME ZONE 'UTC' + INTERVAL '1 HOUR' * 1"
    )

    this.schema.alterTable('sessions', (table) => {
      table.timestamp('last_active_at', { useTz: false }).alter()
    })

    await this.db.rawQuery(
      "UPDATE sessions SET last_active_at = last_active_at AT TIME ZONE 'UTC' + INTERVAL '1 HOUR' * 1"
    )

    this.schema.alterTable('users', (table) => {
      table.timestamp('created_at', { useTz: false }).alter()
      table.timestamp('updated_at', { useTz: false }).alter()
    })

    await this.db.rawQuery(
      "UPDATE users SET created_at = created_at AT TIME ZONE 'UTC' + INTERVAL '1 HOUR' * 1, updated_at = updated_at AT TIME ZONE 'UTC' + INTERVAL '1 HOUR' * 1"
    )
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      table.timestamp('created_at', { useTz: true }).alter()
      table.timestamp('updated_at', { useTz: true }).alter()
    })

    this.schema.alterTable('sessions', (table) => {
      table.timestamp('last_active_at', { useTz: true }).alter()
    })

    this.schema.alterTable('posts', (table) => {
      table.timestamp('created_at', { useTz: true }).alter()
      table.timestamp('updated_at', { useTz: true }).alter()
    })
  }
}
