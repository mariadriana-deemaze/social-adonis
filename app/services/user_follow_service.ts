import UserFollower from '#models/user_follower'
import db from '@adonisjs/lucid/services/db'
import { UUID } from 'node:crypto'

export default class UserFollowService {
  async index(currentUserId: UUID): Promise<number> {
    const [result] = (await db
      .query()
      .from('user_followers')
      .where('user_id', currentUserId)
      .count('*')) as [{ count: number }]
    return result.count
  }

  async show(targetId: UUID, followerUserId: UUID): Promise<UserFollower | null> {
    const [relation] = await UserFollower.query()
      .where('user_id', targetId)
      .andWhere('follower_id', followerUserId)
      .limit(1)
    return relation
  }

  async store(currentUserId: UUID, followerUserId: UUID): Promise<UserFollower> {
    if (currentUserId === followerUserId) throw Error('Duplicate.')
    let relation = await this.show(currentUserId, followerUserId)
    if (relation) return relation
    relation = await UserFollower.create({
      userId: followerUserId,
      followerId: currentUserId, // Creating a relation that targets the current user as a follower
    })
    return relation
  }

  async destroy(targetId: UUID, followerUserId: UUID) {
    const relation = await this.show(targetId, followerUserId)
    if (!relation) return null
    await relation.delete()
  }
}
