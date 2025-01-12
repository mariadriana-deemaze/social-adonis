import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import User from '#models/user'
import Post from '#models/post'
import PostComment from '#models/post_comment'
import { UserFactory } from '#factories/user_factory'

export const PostCommentFactory = factory
  .define(PostComment, async ({ faker }) => {
    const user = await UserFactory.with('posts').create()
    return {
      content: faker.lorem.paragraph(),
      postId: user.posts[0].id,
      userId: user.id,
    }
  })
  .state('posted', (comment) => (comment.deletedAt = null))
  .state('deleted', (comment) => (comment.deletedAt = DateTime.now()))
  .relation('user', () => User)
  .relation('post', () => Post)
  .build()
