import { PostReactionType } from '#enums/post'
import PostReaction from '#models/post_reaction'
import type { UUID } from 'crypto'

export default class PostReactionService {
  constructor() {}

  async show(userId: UUID, postId: UUID): Promise<PostReaction | null> {
    return PostReaction.findBy({
      userId,
      postId,
    })
  }

  async create(
    userId: UUID,
    postId: UUID,
    type: PostReactionType
  ): Promise<[boolean, PostReaction]> {
    const existant = await this.show(userId, postId)

    let resource: PostReaction
    if (existant) {
      resource = await this.update(existant, type)
    } else {
      resource = await PostReaction.create({
        userId,
        postId,
        type,
      })
    }
    return [!!existant, resource]
  }

  async update(reaction: PostReaction, type: PostReactionType): Promise<PostReaction> {
    reaction.type = type
    await reaction.save()
    return reaction
  }

  async destroy(userId: UUID, postId: UUID): Promise<void> {
    const reaction = await this.show(userId, postId)
    if (!reaction) return
    await reaction.delete()
  }
}
