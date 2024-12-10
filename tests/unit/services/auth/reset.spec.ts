import { UserFactory } from '#database/factories/user_factory'
import { UserTokenType } from '#enums/user'
import User from '#models/user'
import UserToken, { generateNewToken } from '#models/user_token'
import AuthService from '#services/auth_service'
import emitter from '@adonisjs/core/services/emitter'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { isAfter } from 'date-fns'
import { DateTime } from 'luxon'

test.group('Auth/reset', (group) => {
  const service: AuthService = new AuthService()
  let user: User

  group.each.setup(async () => {
    await testUtils.db().truncate()
    user = await UserFactory.create()
  })

  test('Successfully creates a reset access token of existing user', async ({
    assert,
    cleanup,
  }) => {
    const events = emitter.fake()

    await service.reset(user)
    const record = await UserToken.findBy({
      type: UserTokenType.RESET_ACCESS,
      userId: user.id,
    })
    assert.containsSubset(record, {
      type: UserTokenType.RESET_ACCESS,
      userId: user.id,
    })
    events.assertEmitted('auth:reset')
    cleanup(() => {
      emitter.restore()
    })
  })

  test('Successfully updates existing reset access token', async ({ assert, cleanup }) => {
    const events = emitter.fake()
    const initialExpDate = DateTime.now().plus({ minutes: 10 })
    const token = generateNewToken(initialExpDate)
    await UserToken.create({
      type: UserTokenType.RESET_ACCESS,
      userId: user.id,
      expiresAt: initialExpDate,
      token,
    })
    await service.reset(user)
    const record = await UserToken.findByOrFail({
      type: UserTokenType.RESET_ACCESS,
      userId: user.id,
    })
    assert.containsSubset(record, {
      type: UserTokenType.RESET_ACCESS,
      userId: user.id,
    })
    assert.isTrue(isAfter(record.expiresAt.toJSDate(), initialExpDate.toJSDate()))
    events.assertEmitted('auth:reset')
    cleanup(() => {
      emitter.restore()
    })
  })
})
