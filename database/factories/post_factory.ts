import factory from '@adonisjs/lucid/factories'
import Post from '#models/post'
import { PostReactionFactory } from '#database/factories/post_reaction_factory'
import User from '#models/user'
import { PostReportFactory } from '#database/factories/post_report_factory'
import { PostCommentFactory } from '#database/factories/post_comment_factory'

const links = [
  'http://www.google.com',
  'http://www.github.com',
  'https://www.youtube.com/watch?v=zK1mLIeXwsQ',
]

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    function contentWithLink() {
      return `${faker.lorem.sentence()} ${links[faker.number.int({ min: 0, max: links.length })]} ${faker.lorem.sentence()}`
    }

    return {
      content: faker.datatype.boolean(0.3) ? contentWithLink() : faker.lorem.paragraph(),
      pinned: faker.datatype.boolean(),
    }
  })
  .state('pinned', (post) => (post.pinned = true))
  .state('unpinned', (post) => (post.pinned = false))
  .relation('user', () => User)
  .relation('reactions', () => PostReactionFactory)
  .relation('reports', () => PostReportFactory)
  .relation('comments', () => PostCommentFactory)
  .build()
