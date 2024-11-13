import { AttachmentType } from '#models/attachment'
import { UUID } from 'crypto'

export interface AttachmentMetadataJSON {
  filename: string
  size: number
  mimetype: string
  extension: string
}

export interface AttachmentResponse {
  id: UUID
  link: string
  type: AttachmentType
  metadata: AttachmentMetadataJSON
}
