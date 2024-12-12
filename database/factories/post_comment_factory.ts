import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import User from '#models/user'
import Post from '#models/post'
import PostComment from '#models/post_comment'

export const PostCommentFactory = factory
  .define(PostComment, async ({ faker }) => {
    return {
      content: faker.lorem.paragraph(),
    }
  })
  .state('posted', (comment) => (comment.deletedAt = null))
  .state('deleted', (comment) => (comment.deletedAt = DateTime.now()))
  .relation('user', () => User)
  .relation('post', () => Post)
  .build()
