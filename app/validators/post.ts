import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Validates the post creation action payload
 */
export const createPostValidator = vine.compile(
  vine.object({
    content: vine.string().minLength(8).maxLength(32),
  })
)

createPostValidator.messagesProvider = new SimpleMessagesProvider({
  required: 'The {{ field }} field is required',
  string: 'The value of {{ field }} field must be a string',
})
