import { PostReactionType } from '#enums/post'
import vine from '@vinejs/vine'

export const MIN_POST_CONTENT_SIZE = 8
export const MAX_POST_CONTENT_SIZE = 256

/**
 * Validates the post creation action payload
 */
export const createPostValidator = vine.compile(
  vine.object({
    content: vine.string().minLength(MIN_POST_CONTENT_SIZE).maxLength(MAX_POST_CONTENT_SIZE),
  })
)

/**
 * Validates the post update action payload
 */
export const updatePostValidator = vine.compile(
  vine.object({
    content: vine.string().minLength(MIN_POST_CONTENT_SIZE).maxLength(MAX_POST_CONTENT_SIZE),
  })
)

/**
 * Validates the post-react create/update action payload
 */
export const postReactionValidator = vine.compile(
  vine.object({
    reaction: vine.enum(PostReactionType),
  })
)
