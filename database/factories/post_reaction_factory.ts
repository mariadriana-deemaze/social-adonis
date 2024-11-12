import factory from '@adonisjs/lucid/factories'
import PostReaction from '#models/post_reaction'
import { UserFactory } from '#database/factories/user_factory'
import { PostReactionType } from '#enums/post'
import { PostFactory } from '#database/factories/post_factory'

export const PostReactionFactory = factory
  .define(PostReaction, async ({ faker }) => {
    return {
      type: faker.helpers.enumValue(PostReactionType),
    }
  })
  .relation('user', () => UserFactory)
  .relation('post', () => PostFactory)
  .build()
