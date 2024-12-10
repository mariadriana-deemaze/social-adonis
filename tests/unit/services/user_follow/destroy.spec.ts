import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import UserFollower from '#models/user_follower'
import UserFollowService from '#services/user_follow_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { randomUUID } from 'node:crypto'

test.group('UserFollow/destroy', (group) => {
  let users: User[] = []
  const service = new UserFollowService()

  group.each.setup(async () => {
    await testUtils.db().truncate()
    users = await UserFactory.createMany(2)
  })

  test('Successfully returns undefined after perform', async ({ assert }) => {
    await UserFollower.create({
      userId: users[0].id,
      followerId: users[1].id,
    })
    const perform = service.destroy(users[0].id, users[1].id)
    const relation = await perform
    assert.doesNotReject(async () => await perform)
    assert.isUndefined(relation)
  })

  test('Should return null if attempted to destroy non-existant relation', async ({ assert }) => {
    const perform = service.destroy(users[0].id, users[1].id)
    const relation = await perform
    assert.doesNotReject(async () => await perform)
    assert.isNull(relation)
  })

  test('Should return null if attempted to destroy non-existant relation with non-existant user', async ({
    assert,
  }) => {
    const perform = service.destroy(users[0].id, randomUUID())
    const relation = await perform
    assert.doesNotReject(async () => await perform)
    assert.isNull(relation)
  })
})
