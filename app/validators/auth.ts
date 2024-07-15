import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Validates the account creation action payload
 */
export const createAuthValidator = vine.compile(
  vine.object({
    fullName: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
    //.confirmed()
  })
)

createAuthValidator.messagesProvider = new SimpleMessagesProvider({
  required: 'The {{ field }} field is required',
  string: 'The value of {{ field }} field must be a string',
  email: 'The value is not a valid email address',
})
