import vine from '@vinejs/vine'

export const MIN_POST_COMMENT_CONTENT_SIZE = 1
export const MAX_POST_COMMENT_CONTENT_SIZE = 256

/**
 * Validates the post comment creation action payload
 */
export const createPostCommentValidator = vine.compile(
  vine.object({
    content: vine
      .string()
      .minLength(MIN_POST_COMMENT_CONTENT_SIZE)
      .maxLength(MAX_POST_COMMENT_CONTENT_SIZE),
    parentId: vine.string().uuid().nullable(),
  })
)

/**
 * Validates the post comment update action payload
 */
export const updatePostCommentValidator = vine.compile(
  vine.object({
    content: vine
      .string()
      .minLength(MIN_POST_COMMENT_CONTENT_SIZE)
      .maxLength(MAX_POST_COMMENT_CONTENT_SIZE),
  })
)
