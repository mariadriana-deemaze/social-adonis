import { PostFactory } from '#factories/post_factory'
import Post from '#models/post'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { randomUUID } from 'node:crypto'

test.group('PostComment/destroy', (group) => {
  let posts: Post[] = []
  let service: PostCommentService = new PostCommentService(new UserService())

  group.each.setup(async () => {
    await testUtils.db().truncate()
    posts = await PostFactory.createMany(1)
  })

  test('Successfully destroys a post comment from the provided params', async ({ assert }) => {
    const perform = service.destroy(posts[0].id)
    const query = await perform
    assert.isNull(query)
    assert.doesNotReject(async () => await perform)
  })

  test('Successfully fails to destroy a post comment from the provided params', async ({
    assert,
  }) => {
    const perform = service.destroy(randomUUID())
    const query = await perform
    assert.isNull(query)
    assert.doesNotReject(async () => await perform)
  })
})
