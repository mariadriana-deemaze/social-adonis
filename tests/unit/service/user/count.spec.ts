import { UserFactory } from '#factories/user_factory'
import User from '#models/user'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('User/countActiveUsers', (group) => {
  let service: UserService = new UserService()
  let users: User[] = []

  group.each.setup(async () => {
    await testUtils
      .db()
      .truncate()
      .then(async (trunc) => await trunc())
    users = await UserFactory.createMany(5)
  })

  test('Succesfully counts 5 active users', async ({ assert }) => {
    const result = await service.countActiveUsers()
    assert.equal(result, 5)
    assert.isNumber(result)
  })

  test('Succesfully counts 4 active users', async ({ assert }) => {
    await users[0].delete()
    const result = await service.countActiveUsers()
    assert.equal(result, 4)
    assert.isNumber(result)
  })
})
