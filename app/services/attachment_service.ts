import Attachment, { AttachmentModel, AttachmentType, MetadataJSON } from '#models/attachment'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import { AttachmentResponse } from 'app/interfaces/attachment'
import { UUID } from 'crypto'

export default class AttachmentService {
  private readonly disk = drive.use()

  constructor() {}

  /**
   * Polymorphic find of many attachments to a specified model.
   */
  async findMany(
    model: AttachmentModel,
    model_id: string
  ): Promise<{
    images: AttachmentResponse[]
  }> {
    const resources: {
      images: AttachmentResponse[]
    } = {
      images: [],
    }

    const attachments = await Attachment.findManyBy({
      model,
      model_id,
    })

    for (const attachment of attachments) {
      const link = await this.disk.getSignedUrl(attachment.external_key)
      resources.images.push({
        id: attachment.id,
        link,
        type: attachment.type,
        metadata: attachment.metadata,
      })
    }

    return resources
  }

  /**
   * Polymorphic find of many attachments to a specified model.
   * Returns the records.
   */
  async findManyRaw(model: AttachmentModel, model_id: string) {
    const attachments = await Attachment.findManyBy({
      model,
      model_id,
    })
    return attachments
  }

  /**
   * Polymorphic find of many attachments to a specified model.
   */
  async deleteMany(model: AttachmentModel, model_id: string): Promise<void> {
    const attachments = await Attachment.findManyBy({
      model,
      model_id,
    })

    for (const attachment of attachments) {
      await this.disk.delete(attachment.external_key)
      await attachment.delete()
    }
  }

  async store(
    { images /* audios, documents */ }: Record<'images' | 'audios' | 'documents', MultipartFile[]>,
    model: AttachmentModel,
    modelId: UUID
  ): Promise<void> {
    // S3
    for (const image of images) {
      const extension = image.extname || image.subtype || image.headers['content-type']

      const attachment = new Attachment()
      attachment.model = model
      attachment.type = AttachmentType.IMAGE
      attachment.model_id = modelId
      attachment.metadata = new MetadataJSON({
        filename: image.clientName,
        size: image.size,
        mimetype: image.headers['content-type'],
        extension,
      })

      const key = this.generateS3Key(AttachmentType.IMAGE, extension)
      await image.moveToDisk(key)
      attachment.external_key = key
      attachment.save()
    }

    // NOTE: Videos could be handed over here to a different provider.
  }

  async storeOne(model: AttachmentModel, modelId: UUID, type: AttachmentType, file: MultipartFile) {
    const extension = file.extname || file.subtype || file.headers['content-type']

    const attachment = new Attachment()
    attachment.model = model
    attachment.type = type
    attachment.model_id = modelId
    attachment.metadata = new MetadataJSON({
      filename: file.clientName,
      size: file.size,
      mimetype: file.headers['content-type'],
      extension,
    })

    let key = this.generateS3Key(type, extension)
    await file.moveToDisk(key)
    attachment.external_key = key
    await attachment.save()
  }

  async getPresignedLink(externalKey: string) {
    return this.disk.getSignedUrl(externalKey)
  }

  /**
   * Updates file in given key.
   */
  async update(key: string, file: MultipartFile) {
    await file.moveToDisk(key)
  }

  /**
   * Generates a key in disk
   */
  private generateS3Key(type: AttachmentType, extension: string) {
    return `uploads/${type}/${cuid()}.${extension}`
  }
}
