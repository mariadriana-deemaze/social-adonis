import { PostCommentFactory } from '#database/factories/post_comment_factory'
import PostComment from '#models/post_comment'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { randomUUID } from 'node:crypto'

test.group('PostComment/index', (group) => {
  let postComments: PostComment[] = []
  let service: PostCommentService = new PostCommentService(new UserService())

  group.each.setup(async () => {
    await testUtils.db().truncate()
    postComments = await PostCommentFactory.createMany(20)
  })

  test('Successfully returns a list of post comments from the provided params', async ({
    assert,
  }) => {
    const perPage = 5
    await PostCommentFactory.merge({ postId: postComments[0].postId }).createMany(5)
    const query = await service.index(postComments[0].postId, { currentPage: 1, limit: perPage })
    assert.properties(query, ['data', 'meta'])
    assert.containsSubset(query, {
      meta: {
        total: 6,
        perPage: perPage,
      },
    })
  })

  test('Successfully fails to return a list of post comments from the provided params', async ({
    assert,
  }) => {
    const perPage = 5
    const query = await service.index(randomUUID(), { currentPage: 1, limit: perPage })
    assert.properties(query, ['data', 'meta'])
    assert.containsSubset(query, {
      data: [],
      meta: {
        total: 0,
        perPage: perPage,
      },
    })
    assert.equal(query.data.length, 0)
  })
})
