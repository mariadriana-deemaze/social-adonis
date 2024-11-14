import factory from '@adonisjs/lucid/factories'
import PostReport from '#models/post_report'
import { PostReportReason } from '#enums/post'
import { UserFactory } from '#database/factories/user_factory'
import { PostFactory } from '#database/factories/post_factory'
import { randomUUID } from 'node:crypto'

export const PostReportFactory = factory
  .define(PostReport, async ({ faker }) => {
    return {
      reason: faker.helpers.enumValue(PostReportReason),
      description: faker.lorem.paragraph(),
      userId: randomUUID(),
      postId: randomUUID(),
    }
  })
  .relation('user', () => UserFactory)
  .relation('post', () => PostFactory)
  .build()
