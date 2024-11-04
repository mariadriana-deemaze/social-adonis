import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const MAX_POST_CONTENT_SIZE = 256

/**
 * Validates the post creation action payload
 */
export const createPostValidator = vine.compile(
  vine.object({
    content: vine.string().minLength(8).maxLength(MAX_POST_CONTENT_SIZE),
  })
)

/**
 * Validates the post creation action payload
 */
export const updatePostValidator = vine.compile(
  vine.object({
    content: vine.string().minLength(8).maxLength(MAX_POST_CONTENT_SIZE),
  })
)

createPostValidator.messagesProvider = new SimpleMessagesProvider({
  required: 'The {{ field }} field is required',
  string: 'The value of {{ field }} field must be a string',
})
