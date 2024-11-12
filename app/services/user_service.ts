import { AttachmentModel } from '#models/attachment'
import User from '#models/user'
import AttachmentService from '#services/attachment_service'
import { HttpContext } from '@adonisjs/core/http'
import { UUID } from 'crypto'

export class UserService {
  private readonly attachmentService: AttachmentService

  constructor() {
    this.attachmentService = new AttachmentService()
  }

  async update(
    user: User,
    payload: {
      username: string
      email: string
      name: string | null
      surname: string | null
    }
  ) {
    Object.assign(user, payload)
    await user.save()
  }

  async storeAttachments(ctx: HttpContext) {
    const avatar = ctx.request.files('avatar', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    })

    const cover = ctx.request.files('cover', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    })

    await this.attachmentService.store(
      {
        images: [avatar, cover].flat(),
        documents: [],
        audios: [],
      },
      AttachmentModel.USER,
      ctx.auth.user?.id!
    )
  }

  async deleteAttachments(id: UUID): Promise<void> {
    return this.attachmentService.deleteMany(AttachmentModel.USER, id)
  }

  async serialize(user: User) {
    const attachments = await this.attachmentService.findMany(AttachmentModel.USER, user.id)
    const data = user.toJSON()
    return {
      ...data,
      attachments,
    }
  }
}
