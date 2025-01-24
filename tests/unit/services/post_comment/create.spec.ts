import { UserFactory } from '#factories/user_factory'
import User from '#models/user'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

test.group('PostComment/create', (group) => {
  let user: User
  let userPost: User
  let service: PostCommentService = new PostCommentService(new UserService())

  group.each.setup(async () => {
    await testUtils.db().truncate()
    user = await UserFactory.create()
    userPost = await UserFactory.with('posts', 1).create()
  })

  test('Successfully creates a post comment from the provided params', async ({ assert }) => {
    const content = faker.lorem.sentence()
    const query = await service.create(userPost.posts[0].id, user.id, {
      content,
    })
    assert.containsSubset(query, { postId: userPost.posts[0].id, content })
  })

  test('Successfully fails to create a post comment from the provided params', async ({
    assert,
  }) => {
    const content = faker.lorem.paragraphs(10)
    const perform = service.create(userPost.posts[0].id, user.id, {
      content,
    })
    assert.rejects(async () => await perform)
  })
})
