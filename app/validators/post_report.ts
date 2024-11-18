import { PostReportReason, PostReportStatus } from '#enums/post'
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

/**
 * Validates the post-report create/update action payload
 */
export const adminUpdatePostReportValidator = vine.compile(
  vine.object({
    status: vine.enum([PostReportStatus.ACCEPTED, PostReportStatus.REJECTED]),
  })
)
