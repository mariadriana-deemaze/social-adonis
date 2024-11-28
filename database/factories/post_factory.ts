import factory from '@adonisjs/lucid/factories'
import Post from '#models/post'
import { PostReactionFactory } from '#database/factories/post_reaction_factory'
import User from '#models/user'
import { PostReportFactory } from '#database/factories/post_report_factory'

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    return {
      content: faker.lorem.paragraph(),
      pinned: faker.datatype.boolean(),
    }
  })
  .state('pinned', (post) => (post.pinned = true))
  .state('unpinned', (post) => (post.pinned = false))
  .relation('user', () => User)
  .relation('reactions', () => PostReactionFactory)
  .relation('reports', () => PostReportFactory)
  .build()
