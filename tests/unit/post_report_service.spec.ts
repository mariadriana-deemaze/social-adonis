import PostReport from '#models/post_report'
import PostReportService from '#services/post_report_service'
import { PostReportReason } from '#enums/post'
import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import { errors } from '@vinejs/vine'

test.group('Post report service', (group) => {
  const service = new PostReportService()

  const validPayload = {
    reason: PostReportReason.ADULTERY,
    description: faker.lorem.paragraph(),
  }

  const invalidPayload = {
    reason: faker.lorem.word(),
    description: true,
  }

  group.each.setup(() => testUtils.db().truncate())

  test('Succesfully creates a new post report with valid payload', async ({ assert }) => {
    const user = await UserFactory.with('posts', 1).create()
    const result = await service.create(user.id, user.posts[0], validPayload)
    assert.instanceOf(result, PostReport)
    assert.containsSubset(result, validPayload)
  })

  test('Fails to create a new post report with invalid payload', async ({ assert }) => {
    const user = await UserFactory.with('posts', 1).create()

    let result: PostReport | typeof errors.E_VALIDATION_ERROR
    try {
      result = await service.create(user.id, user.posts[0], invalidPayload)
    } catch (error) {
      result = error
    }

    assert.instanceOf(result, errors.E_VALIDATION_ERROR)
    assert.containsSubset(JSON.parse(JSON.stringify(result)), {
      messages: [
        { message: 'The selected reason is invalid', field: 'reason' },
        { message: 'The value of description field must be a string', field: 'description' },
      ],
    })
  })

  test('Succesfully updates a post report with valid payload', async ({ assert }) => {
    const reportingUser = await UserFactory.create()
    const user = await UserFactory.with('posts', 1, (post) =>
      post.with('reports', 1, (report) =>
        report.merge({
          userId: reportingUser.id,
        })
      )
    ).create()
    const report = user.posts[0].reports[0]
    const result = await service.update(report, validPayload)
    assert.instanceOf(result, PostReport)
    assert.containsSubset(result, validPayload)
  })

  test('Fails to update a post report with invalid payload', async ({ assert }) => {
    const reportingUser = await UserFactory.create()
    const user = await UserFactory.with('posts', 1, (post) =>
      post.with('reports', 1, (report) =>
        report.merge({
          userId: reportingUser.id,
        })
      )
    ).create()
    const report = user.posts[0].reports[0]

    let result: PostReport | typeof errors.E_VALIDATION_ERROR
    try {
      result = await service.update(report, invalidPayload)
    } catch (error) {
      result = error
    }
    assert.instanceOf(result, errors.E_VALIDATION_ERROR)
    assert.containsSubset(JSON.parse(JSON.stringify(result)), {
      messages: [
        { message: 'The selected reason is invalid', field: 'reason' },
        { message: 'The value of description field must be a string', field: 'description' },
      ],
    })
  })

  test('Succesfully deletes a post report', async ({ assert }) => {
    const reportingUser = await UserFactory.create()
    const user = await UserFactory.with('posts', 1, (post) =>
      post.with('reports', 1, (report) =>
        report.merge({
          userId: reportingUser.id,
        })
      )
    ).create()
    const report = user.posts[0].reports[0]
    assert.doesNotThrow(() => service.delete(report))
  })
})
