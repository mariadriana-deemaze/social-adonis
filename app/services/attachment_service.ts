import Attachment, { AttachmentModel, AttachmentType, MetadataJSON } from "#models/attachment";
import { MultipartFile } from "@adonisjs/core/bodyparser";
import { cuid } from "@adonisjs/core/helpers";
import drive from "@adonisjs/drive/services/main";
import { AttachmentResponse } from "app/interfaces/attachment";
import { UUID } from "crypto";

export default class AttachmentService {

  private readonly disk = drive.use();

  constructor() { }

  /**
   * Polymorphic find of many attachments to a specified model.
   */
  async findMany(model: AttachmentModel, model_id: string): Promise<{
    images: AttachmentResponse[]
  }> {

    const resources: {
      images: AttachmentResponse[];
    } = {
      images: []
    }

    const attachments = await Attachment.findManyBy({
      model,
      model_id
    })

    for (const attachment of attachments) {
      const link = await this.disk.getSignedUrl(attachment.external_key);
      resources.images.push({
        id: attachment.id,
        link,
        metadata: attachment.metadata
      })
    }

    return resources
  }

  /**
   * Polymorphic find of many attachments to a specified model.
   */
  async deleteMany(model: AttachmentModel, model_id: string): Promise<void> {
    const attachments = await Attachment.findManyBy({
      model,
      model_id
    })

    for (const attachment of attachments) {
      await this.disk.delete(attachment.external_key);
      await attachment.delete()
    }
  }


  async store(
    { images, /* audios, documents */ }: Record<'images' | 'audios' | 'documents', MultipartFile[]>,
    model: AttachmentModel,
    modelId: UUID,
  ): Promise<void> {
    // S3
    for (const image of images) {

      const extension = image.extname || image.subtype || image.headers['content-type'];

      const attachment = new Attachment();
      attachment.model = model;
      attachment.type = AttachmentType.IMAGE;
      attachment.model_id = modelId;
      attachment.metadata = new MetadataJSON({
        filename: image.clientName,
        size: image.size,
        mimetype: image.headers['content-type'],
        extension
      })

      const key = this.generateS3Key(AttachmentType.IMAGE, extension);
      await image.moveToDisk(key)
      attachment.external_key = key;
      attachment.save();
    }

    // NOTE: Videos could be handed over here to a different provider.
  }


  private generateS3Key(type: AttachmentType, extension: string) {
    return `uploads/${type}/${cuid()}.${extension}`
  }

}
