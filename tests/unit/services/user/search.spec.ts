import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

const getExpectedMatches = (users: User[], searchRegExp: RegExp) =>
  users.filter((user) => searchRegExp.test(user.username) || searchRegExp.test(user.name || ''))

test.group('User/search', (group) => {
  let users: User[] = []
  let service: UserService = new UserService()

  group.each.setup(async () => {
    await testUtils
      .db()
      .truncate()
      .then(async (trunc) => await trunc())
    users = await UserFactory.createMany(20)
  })

  test('Successfully searches for users with the ample provided params', async ({ assert }) => {
    const perPage = 5
    const query = await service.search('', { page: 1, limit: perPage })
    assert.properties(query, ['data', 'meta'])
    assert.containsSubset(query, {
      meta: {
        total: 20,
        perPage: perPage,
      },
    })
    assert.equal(query.data.length, perPage)
  })

  test('Successfully returns one user within the provided params', async ({ assert }) => {
    const user = users[0]
    user.name = 'Johnny Bravo'
    user.username = 'bravissimo87'
    await user.save()

    const perPage = 5
    const searchTerm = 'bravissimo8'
    const searchRegExp = new RegExp(searchTerm)
    const query = await service.search(searchTerm, { page: 1, limit: perPage })
    const expectedMatches = getExpectedMatches(users, searchRegExp)
    assert.properties(query, ['data', 'meta'])
    assert.containsSubset(query, {
      meta: {
        total: expectedMatches.length,
        perPage: perPage,
      },
    })
    assert.equal(query.data.length, expectedMatches.length)
  })

  test('Successfully fails to find a user with provided params', async ({ assert }) => {
    const perPage = 10
    const searchTerm = 'will_not_match'
    const searchRegExp = new RegExp(searchTerm)
    const query = await service.search(searchTerm, { page: 1, limit: perPage })
    const expectedMatches = getExpectedMatches(users, searchRegExp)
    assert.properties(query, ['data', 'meta'])
    assert.containsSubset(query, {
      meta: {
        total: expectedMatches.length,
        perPage: perPage,
      },
    })
    assert.equal(query.data.length, expectedMatches.length)
  })
})
