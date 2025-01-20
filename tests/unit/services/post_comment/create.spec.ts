import { PostFactory } from '#factories/post_factory'
import { UserFactory } from '#factories/user_factory'
import Post from '#models/post'
import User from '#models/user'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

test.group('PostComment/create', (group) => {
  let posts: Post[] = []
  let user: User
  let service: PostCommentService = new PostCommentService(new UserService())

  group.each.setup(async () => {
    await testUtils.db().truncate()
    user = await UserFactory.create()
    posts = await PostFactory.createMany(1)
  })

  test('Successfully creates a post comment from the provided params', async ({ assert }) => {
    const content = faker.lorem.sentence()
    const query = await service.create(posts[0].id, user.id, {
      content,
    })
    assert.containsSubset(query, { id: posts[0].id, content: posts[0].content })
  })

  test('Successfully fails to create a post comment from the provided params', async ({
    assert,
  }) => {
    const content = faker.lorem.paragraphs(10)
    const query = await service.create(posts[0].id, user.id, {
      content,
    })
    assert.containsSubset(query, { id: posts[0].id, content: posts[0].content })
  })
})
