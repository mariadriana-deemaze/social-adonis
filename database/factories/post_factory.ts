import factory from '@adonisjs/lucid/factories'
import Post from '#models/post'
import { PostReactionFactory } from '#database/factories/post_reaction_factory'

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    return {
      content: faker.lorem.paragraph(),
    }
  })
  .relation('reactions', () => PostReactionFactory)
  .build()
