import { PostReactionType } from '#enums/post';
import PostReaction from '#models/post_reaction'
import type { UUID } from 'crypto'

export default class PostReactionService {
  constructor() {}

  create(userId: UUID, postId: UUID) {
    return PostReaction.create({
      userId,
      postId,
    })
  }

  async update(userId: UUID, postId: UUID, type: PostReactionType): Promise<PostReaction | null> {
    const reaction = await PostReaction.findBy({
      userId,
      postId,
    })
    if (!reaction) return null;
    await reaction.save()
    return reaction
  }

  async destroy(userId: UUID, postId: UUID): Promise<void> {
    const reaction = await PostReaction.findBy({
      userId,
      postId,
    })
    if (!reaction) return
    reaction.delete()
  }
}
