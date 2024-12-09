import { UserFactory } from '#database/factories/user_factory'
import PostPinService from '#services/post_pin_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { randomUUID } from 'node:crypto'

test.group('Post pin service create', (group) => {
  const service: PostPinService = new PostPinService()

  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  test('Succesfully counts user pins', async ({ assert }) => {
    const user = await UserFactory.with('posts', 3, (post) => post.apply('unpinned')).create()
    await service.pin(user.posts[0], !user.posts[0].pinned)
    const count = await service.count(user.id)
    assert.equal(count, 1)
  })

  test('Succesfully fails to count post pins fron non-existant user', async ({ assert }) => {
    const count = await service.count(randomUUID())
    assert.equal(count, 0)
  })
})
