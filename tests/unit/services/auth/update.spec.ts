import { UserFactory } from '#database/factories/user_factory'
import { UserTokenType } from '#enums/user'
import User from '#models/user'
import UserToken, { generateNewToken } from '#models/user_token'
import AuthService from '#services/auth_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { DateTime } from 'luxon'

test.group('Auth/update', (group) => {
  const service: AuthService = new AuthService()
  let user: User

  group.each.setup(async () => {
    await testUtils.db().truncate()
    user = await UserFactory.create()
  })

  test('Successfully updates a user password', async ({ assert }) => {
    const expiresAt = DateTime.now().plus({ minutes: 10 })
    const token = generateNewToken(expiresAt)
    const password = faker.internet.password()
    assert.doesNotReject(
      async () => await service.update(token, { password, passwordConfirmation: password })
    )
  })

  test('Should throw error if token record does not exist', async ({ assert }) => {
    const expiresAt = DateTime.now().plus({ minutes: 10 })
    const token = generateNewToken(expiresAt)
    const password = faker.internet.password()
    assert.rejects(
      async () => await service.update(token, { password, passwordConfirmation: password })
    )
  })

  test('Should throw error if payload passwords do not match', async ({ assert }) => {
    const expiresAt = DateTime.now().plus({ minutes: 10 })
    const token = generateNewToken(expiresAt)
    const password = faker.internet.password()
    assert.rejects(
      async () => await service.update(token, { password, passwordConfirmation: password + 'lol' })
    )
  })

  test('Should throw error if token record has expired', async ({ assert }) => {
    const expiresAt = DateTime.now().minus({ minutes: 10 })
    const token = generateNewToken(expiresAt)
    await UserToken.create({
      type: UserTokenType.RESET_ACCESS,
      userId: user.id,
      expiresAt,
      token,
    })
    const password = faker.internet.password()
    assert.rejects(
      async () => await service.update(token, { password, passwordConfirmation: password })
    )
  })
})
