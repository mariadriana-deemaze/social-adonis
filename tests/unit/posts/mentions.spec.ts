import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import emitter from '@adonisjs/core/services/emitter'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

test.group('Post mentions', (group) => {
  let user: User

  group.each.setup(async () => {
    await testUtils.db().truncate()
    user = await UserFactory.create()
  })

  test('Successfully parses and emits notifications of post mentions', async ({
    assert,
    cleanup,
  }) => {
    const events = emitter.fake()

    const userPost = await UserFactory.with('posts', 1, (post) =>
      post.merge({
        content: `${faker.lorem.sentence()}  @${user.username} ${faker.lorem.sentence()}`,
      })
    ).create()

    assert.deepEqual(
      userPost.posts[0].matches.entries(),
      new Map().set('@', [user.username]).entries()
    )

    events.assertEmitted('post:mention', ({ data }) => {
      let validate = true
      const expectedMentions = [user.username]
      const expectedPost = userPost.posts[0]
      if (data[0][0] !== expectedMentions[0]) validate = false
      if (data[1].id !== expectedPost.id) validate = false
      return validate
    })

    cleanup(() => {
      emitter.restore()
    })
  })

  test('Successfully parses and emits notifications of post mentions, but fails to notify non-existent user', async ({
    assert,
    cleanup,
  }) => {
    const events = emitter.fake()

    const noneExistantUserName = 'john_doe'

    const userPost = await UserFactory.with('posts', 1, (post) =>
      post.merge({
        content: `${faker.lorem.sentence()}  @${noneExistantUserName} ${faker.lorem.sentence()}`,
      })
    ).create()

    assert.deepEqual(
      userPost.posts[0].matches.entries(),
      new Map().set('@', [noneExistantUserName]).entries()
    )

    events.assertEmitted('post:mention', ({ data }) => {
      let validate = true
      const expectedMentions = [noneExistantUserName]
      const expectedPost = userPost.posts[0]
      if (data[0][0] !== expectedMentions[0]) validate = false
      if (data[1].id !== expectedPost.id) validate = false
      return validate
    })

    const mentioned = await User.findBy('username', noneExistantUserName)
    assert.equal(mentioned, null)

    cleanup(() => {
      emitter.restore()
    })
  })
})
