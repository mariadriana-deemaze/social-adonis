import { PaginatedResponse } from './../interfaces/pagination'
import { AttachmentResponse } from '#interfaces/attachment'
import { UserResponse } from '#interfaces/user'
import { AttachmentModel, AttachmentType } from '#models/attachment'
import User from '#models/user'
import AttachmentService from '#services/attachment_service'
import { HttpContext } from '@adonisjs/core/http'
import { UUID } from 'node:crypto'

export class UserService {
  private readonly attachmentService: AttachmentService

  constructor() {
    this.attachmentService = new AttachmentService()
  }

  async search(
    searchTerm: string,
    { page, limit = 10 }: { page: number; limit?: number }
  ): Promise<PaginatedResponse<UserResponse>> {
    const search = `%${searchTerm}%`

    const result = await User.query()
      .whereILike('username', search)
      .orWhereILike('name', search)
      .orderBy('updated_at', 'desc')
      .paginate(page, limit)

    const { meta } = result.toJSON()

    const data: UserResponse[] = []
    for (const user of result) {
      const resource = await this.serialize(user)
      data.push(resource)
    }

    return {
      data,
      meta,
    }
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

  async destroy(user: User) {
    return user.delete()
  }

  async storeAttachments(ctx: HttpContext) {
    const currentUserId = ctx.auth.user?.id!

    const avatar = ctx.request.file('avatar', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    })

    const cover = ctx.request.file('cover', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    })

    const keys = await this.attachmentService
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

    if (avatar) {
      if (keys.Avatar) {
        await this.attachmentService.update(keys.Avatar, avatar)
      } else {
        await this.attachmentService.storeOne(
          AttachmentModel.USER,
          currentUserId,
          AttachmentType.AVATAR,
          avatar
        )
      }
    }

    if (cover) {
      if (keys.Cover) {
        await this.attachmentService.update(keys.Cover, cover)
      } else {
        await this.attachmentService.storeOne(
          AttachmentModel.USER,
          currentUserId,
          AttachmentType.COVER,
          cover
        )
      }
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
      verified: data.verified,
      name: data.name,
      surname: data.surname,
      fullname: data.fullName,
      username: data.username,
      email: data.email,
      attachments,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }

    return resource
  }
}
