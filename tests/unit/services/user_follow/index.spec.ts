import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import UserFollower from '#models/user_follower'
import UserFollowService from '#services/user_follow_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('UserFollow/index', (group) => {
  let users: User[] = []
  const service = new UserFollowService()

  group.each.setup(async () => {
    await testUtils.db().truncate()
    users = await UserFactory.createMany(2)
  })

  test('Should return 0', async ({ assert }) => {
    const count = await service.index(users[0].id)
    assert.equal(count, 0)
  })

  test('Should return 1', async ({ assert }) => {
    await UserFollower.create({
      userId: users[0].id,
      followerId: users[1].id,
    })
    const count = await service.index(users[0].id)
    assert.equal(count, 1)
  })
})
