import { AttachmentResponse } from '#interfaces/attachment'
import { UserResponse } from '#interfaces/user'
import { AttachmentModel, AttachmentType } from '#models/attachment'
import User from '#models/user'
import AttachmentService from '#services/attachment_service'
import { HttpContext } from '@adonisjs/core/http'
import { UUID } from 'crypto'

export class UserService {
  private readonly attachmentService: AttachmentService

  constructor() {
    this.attachmentService = new AttachmentService()
  }

  async findOne(id: UUID): Promise<UserResponse | null> {
    const user = await User.find(id)
    if (!user) return null
    const resource = await this.serialize(user)
    return resource
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
    const currentUserId = ctx.auth.user?.id!

    const avatar = ctx.request.files('avatar', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    })

    const cover = ctx.request.files('cover', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    })

    const attachments = await this.attachmentService
      .findManyRaw(AttachmentModel.USER, currentUserId)
      .then((result) => {
        return result.reduce(
          (acc, next) => {
            const type = next.type as AttachmentType.AVATAR | AttachmentType.COVER
            acc[type] = next.external_key
            return acc
          },
          { [AttachmentType.AVATAR]: null, [AttachmentType.COVER]: null } as Record<
            'Avatar' | 'Cover',
            string | null
          >
        )
      })

    if (avatar && attachments.Avatar) {
      await this.attachmentService.update(attachments.Avatar, avatar[0])
    } else {
      await this.attachmentService.storeOne(
        AttachmentModel.USER,
        currentUserId,
        AttachmentType.AVATAR,
        avatar[0]
      )
    }

    if (cover && attachments.Cover) {
      await this.attachmentService.update(attachments.Cover, cover[0])
    } else {
      await this.attachmentService.storeOne(
        AttachmentModel.USER,
        currentUserId,
        AttachmentType.COVER,
        cover[0]
      )
    }
  }

  async deleteAttachments(id: UUID): Promise<void> {
    return this.attachmentService.deleteMany(AttachmentModel.USER, id)
  }

  async serialize(user: User): Promise<UserResponse> {
    const data = user.toJSON()

    const attachments: Record<'avatar' | 'cover', AttachmentResponse | null> = {
      avatar: null,
      cover: null,
    }

    const attached = await this.attachmentService.findManyRaw(AttachmentModel.USER, user.id)

    for (const attachment of attached) {
      const link = await this.attachmentService.getPresignedLink(attachment.external_key)
      let item: AttachmentResponse = {
        id: attachment.id,
        type: attachment.type,
        link,
        metadata: attachment.metadata,
      }

      if (attachment.type === AttachmentType.AVATAR) {
        attachments.avatar = item
      }
      if (attachment.type === AttachmentType.COVER) {
        attachments.cover = item
      }
    }

    const resource: UserResponse = {
      id: data.id,
      role: data.role,
      name: data.name,
      surname: data.surname,
      username: data.username,
      email: data.email,
      attachments,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }

    return resource
  }
}
