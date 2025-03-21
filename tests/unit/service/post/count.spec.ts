import { UserFactory } from '#factories/user_factory'
import User from '#models/user'
import PostsService from '#services/posts_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Post/countTotalPosts', (group) => {
  let service: PostsService = new PostsService()
  let users: User[] = []

  group.each.setup(async () => {
    await testUtils
      .db()
      .truncate()
      .then(async (trunc) => await trunc())
    users = await UserFactory.with('posts').createMany(5)
  })

  test('Succesfully counts 5 posts', async ({ assert }) => {
    const result = await service.countTotalPosts()
    assert.equal(result, 5)
    assert.isNumber(result)
  })

  test('Succesfully counts 4 posts', async ({ assert }) => {
    await users[0].posts[0].delete()
    const result = await service.countTotalPosts()
    assert.equal(result, 4)
    assert.isNumber(result)
  })
})
