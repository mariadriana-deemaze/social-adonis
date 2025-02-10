import { PostCommentFactory } from '#factories/post_comment_factory'
import PostComment from '#models/post_comment'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

test.group('PostComment/update', (group) => {
  let postComments: PostComment[] = []
  let service: PostCommentService = new PostCommentService(new UserService())

  group.each.setup(async () => {
    await testUtils.db().truncate()
    postComments = await PostCommentFactory.createMany(20)
  })

  test('Successfully updates a post comment from the provided params', async ({ assert }) => {
    const content = faker.lorem.sentence()
    const perform = service.update(postComments[0].id, { content })
    const query = await perform
    assert.doesNotReject(async () => await perform)
    assert.containsSubset(query, { id: postComments[0].id, content })
  })

  test('Successfully fails to update a post comment from the provided params', async ({
    assert,
  }) => {
    const content = faker.lorem.paragraphs(10)
    const perform = service.update(postComments[0].id, { content })
    assert.rejects(async () => await perform)
  })
})
