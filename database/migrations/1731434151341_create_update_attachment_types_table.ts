import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.raw(`ALTER TYPE "attachment_type" ADD VALUE IF NOT EXISTS 'Avatar'`)
    this.schema.raw(`ALTER TYPE "attachment_type" ADD VALUE IF NOT EXISTS 'Cover'`)
  }

  async down() {}
}
