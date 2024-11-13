import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Validates the account creation action payload
 */
export const createAuthValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine
      .string()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      })
      .email(),
    password: vine.string().minLength(8).maxLength(32).confirmed({
      confirmationField: 'passwordConfirmation',
    }),
    passwordConfirmation: vine.string().minLength(8).maxLength(32),
  })
)

createAuthValidator.messagesProvider = new SimpleMessagesProvider({
  required: 'The {{ field }} field is required',
  string: 'The value of {{ field }} field must be a string',
  email: 'The value is not a valid email address',
})
