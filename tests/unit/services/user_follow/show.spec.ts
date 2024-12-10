import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import UserFollower from '#models/user_follower'
import UserFollowService from '#services/user_follow_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('UserFollow/show', (group) => {
  let users: User[] = []
  const service = new UserFollowService()

  group.each.setup(async () => {
    await testUtils.db().truncate()
    users = await UserFactory.createMany(2)
  })

  test('Should return undefined', async ({ assert }) => {
    const [user, follower] = users
    const perform = service.show(user.id, follower.id)
    const relation = await perform
    assert.doesNotThrow(async () => await perform)
    assert.isUndefined(relation)
  })

  test('Should return existing relation', async ({ assert }) => {
    const [user, follower] = users
    await UserFollower.create({
      userId: user.id,
      followerId: follower.id,
    })
    const perform = service.show(user.id, follower.id)
    const relation = await perform
    assert.doesNotThrow(async () => await perform)
    assert.isDefined(relation)
  })
})
