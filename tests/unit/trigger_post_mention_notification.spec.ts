import { UserFactory } from '#database/factories/user_factory'
import TriggerPostMentionNotification from '#listeners/trigger_post_mention_notification'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Trigger post mention notification', (group) => {
  let users: User[]
  let instance: TriggerPostMentionNotification = new TriggerPostMentionNotification()

  group.each.setup(async () => {
    await testUtils.db().truncate()
    users = await UserFactory.createMany(3)
  })

  test('Successfully extracts notifiables when provided with existant users', async ({
    assert,
  }) => {
    const mentions = users.map((user) => user.username)
    const notifiables = await instance.notifiables(mentions)
    assert.deepEqual(
      notifiables.map((notifiable) => notifiable.username),
      mentions
    )
  })

  test('Successfully extracts notifiables when provided with both existant and non-existant users', async ({
    assert,
  }) => {
    const mentions = users.map((user) => user.username)
    mentions.push('john_doe')
    const notifiables = await instance.notifiables(mentions)
    mentions.pop()
    assert.deepEqual(
      notifiables.map((notifiable) => notifiable.username),
      mentions
    )
  })

  test('Fails to extract notifiables when provided with non-existant users', async ({ assert }) => {
    const mentions = ['john_doe']
    const notifiables = await instance.notifiables(mentions)
    assert.deepEqual(
      notifiables.map((notifiable) => notifiable.username),
      []
    )
  })
})
