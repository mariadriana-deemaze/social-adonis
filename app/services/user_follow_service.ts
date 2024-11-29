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

  async show(currentUserId: UUID, followerUserId: UUID): Promise<UserFollower | null> {
    const [relation] = await UserFollower.query()
      .where('user_id', currentUserId)
      .andWhere('follower_id', followerUserId)
      .limit(1)
    return relation
  }

  async store(currentUserId: UUID, followerUserId: UUID): Promise<UserFollower> {
    if (currentUserId === followerUserId) throw Error('Duplicate.')
    let relation = await this.show(currentUserId, followerUserId)
    if (relation) return relation
    relation = await UserFollower.create({
      userId: currentUserId,
      followerId: followerUserId,
    })
    return relation
  }

  async destroy(currentUserId: UUID, followerUserId: UUID) {
    const relation = await this.show(currentUserId, followerUserId)
    if (!relation) return null
    await relation.delete()
  }
}
