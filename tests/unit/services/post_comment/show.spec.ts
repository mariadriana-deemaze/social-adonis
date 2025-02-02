import { PostCommentFactory } from '#factories/post_comment_factory'
import PostComment from '#models/post_comment'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

test.group('PostComment/show', (group) => {
  let postComments: PostComment[] = []
  let service: PostCommentService = new PostCommentService(new UserService())

  group.each.setup(async () => {
    await testUtils.db().truncate()
    postComments = await PostCommentFactory.apply('posted').createMany(20)
  })

  test('Successfully returns a post comment from the provided params', async ({ assert }) => {
    const query = await service.show(postComments[0].id, { currentPage: 1, limit: 10 })
    assert.equal(query?.id, postComments[0].id)
  })

  test('Successfully fails to return a post comment from the provided params', async ({
    assert,
  }) => {
    const query = await service.show(randomUUID(), { currentPage: 1, limit: 10 })
    assert.equal(query, null)
  })

  test('Successfully returns a soft-deleted post comment from the provided params', async ({
    assert,
  }) => {
    const comment = postComments[0]
    comment.deletedAt = DateTime.now()
    await comment.save()
    const query = await service.show(postComments[0].id, { currentPage: 1, limit: 10 })
    assert.equal(query?.id, postComments[0].id)
    assert.equal(query?.content, 'Comment deleted.')
  })
})
