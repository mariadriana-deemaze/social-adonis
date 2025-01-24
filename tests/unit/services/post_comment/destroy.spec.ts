import { PostCommentFactory } from '#factories/post_comment_factory'
import PostComment from '#models/post_comment'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { randomUUID } from 'node:crypto'

test.group('PostComment/destroy', (group) => {
  let postComments: PostComment[] = []
  let service: PostCommentService = new PostCommentService(new UserService())

  group.each.setup(async () => {
    await testUtils.db().truncate()
    postComments = await PostCommentFactory.createMany(1)
  })

  test('Successfully destroys a post comment from the provided params', async ({ assert }) => {
    const perform = service.destroy(postComments[0].id)
    const query = await perform
    assert.containsSubset(query, { id: postComments[0].id })
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
