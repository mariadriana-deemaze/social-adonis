import { REGEX } from '#utils/index'
import vine from '@vinejs/vine'

/**
 * Validates the user update action payload
 */
export const updateUserValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .trim()
      .regex(REGEX.ALPHANUMERIC_STRING)
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .whereNot('id', field.meta.userId)
          .where('username', value)
          .first()
        return !user
      })
      .minLength(1)
      .maxLength(50),
    email: vine
      .string()
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .whereNot('id', field.meta.userId)
          .where('email', value)
          .first()
        return !user
      })
      .email(),
    name: vine.string().regex(REGEX.ALPHA_STRING).minLength(1).maxLength(50).nullable(),
    surname: vine.string().regex(REGEX.ALPHA_STRING).minLength(1).maxLength(50).nullable(),
    avatar: vine.file().nullable(),
    cover: vine.file().nullable(),
  })
)
