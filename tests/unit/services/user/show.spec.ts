import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('User/show', (group) => {
  let users: User[] = []
  let service: UserService = new UserService()

  group.each.setup(async () => {
    await testUtils.db().truncate()
    users = await UserFactory.createMany(5)
  })

  test('Successfully queries for a specific user', async ({ assert }) => {
    const query = await service.findOne(users[2].id)
    assert.properties(query, [
      'id',
      'role',
      'name',
      'surname',
      'fullname',
      'username',
      'email',
      'verified',
      'followersCount',
      'attachments',
    ])
    assert.equal(users[2].id, query?.id)
  })
})
