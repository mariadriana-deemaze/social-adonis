import { PostFactory } from '#factories/post_factory'
import Post from '#models/post'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

test.group('PostComment/update', (group) => {
  let posts: Post[] = []
  let service: PostCommentService = new PostCommentService(new UserService())

  group.each.setup(async () => {
    await testUtils.db().truncate()
    posts = await PostFactory.createMany(1)
  })

  test('Successfully updates a post comment from the provided params', async ({ assert }) => {
    const content = faker.lorem.sentence()
    const query = await service.update(posts[0].id, content)
    assert.containsSubset(query, { id: posts[0].id, content: posts[0].content })
  })

  test('Successfully fails to update a post comment from the provided params', async ({
    assert,
  }) => {
    const content = faker.lorem.paragraphs(10)
    const query = await service.update(posts[0].id, content)
    assert.containsSubset(query, { id: posts[0].id, content: posts[0].content })
  })
})
