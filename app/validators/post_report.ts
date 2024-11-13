import { PostReportReason } from '#enums/post'
import vine from '@vinejs/vine'

/**
 * Validates the post-report create/update action payload
 */
export const postReportValidator = vine.compile(
 vine.object({
  reason: vine.enum(PostReportReason),
  description: vine.string(),
 })
)
