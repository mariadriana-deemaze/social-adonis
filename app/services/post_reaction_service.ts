import { PostReactionType } from '#enums/post'
import Post from '#models/post'
import PostReaction from '#models/post_reaction'
import User from '#models/user'
import PostOwnerReactionNotification from '#notifications/post_owner_reaction_notification'
import logger from '@adonisjs/core/services/logger'
import type { UUID } from 'node:crypto'

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

    await this.notify(userId, resource.postId, type)

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

  /**
   * Notifies the post owner of someone reacting to their post.
   */
  private async notify(userId: UUID, postId: UUID, type: PostReactionType) {
    const currentUser = await User.find(userId)
    const post = await Post.find(postId)

    if (!post || !currentUser) {
      logger.error('Error in sending the post owner notifications.')
      return
    }

    await post.load('user')

    try {
      if (currentUser.id === post.userId) return
      await post.user.notify(new PostOwnerReactionNotification(currentUser, post, type))
    } catch (error) {
      logger.error(`Error in notifying user: ${JSON.stringify(error, null, 2)}`)
    }
  }
}
