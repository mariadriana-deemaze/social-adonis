import { UserFactory } from '#database/factories/user_factory'
import PostPinService from '#services/post_pin_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Post pin service create', (group) => {
  const service: PostPinService = new PostPinService()

  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  test('Succesfully pins a post', async ({ assert }) => {
    const user = await UserFactory.with('posts', 1, (post) => post.apply('unpinned')).create()
    await service.pin(user.posts[0], !user.posts[0].pinned)
    assert.isTrue(user.posts[0].pinned)
  })

  test('Succesfully unpins a post', async ({ assert }) => {
    const user = await UserFactory.with('posts', 1, (post) => post.apply('pinned')).create()
    await service.pin(user.posts[0], !user.posts[0].pinned)
    assert.isFalse(user.posts[0].pinned)
  })
})
