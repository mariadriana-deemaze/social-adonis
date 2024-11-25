import { UserFactory } from '#database/factories/user_factory'
import { NotificationType } from '#enums/notification'
import { PostReactionType } from '#enums/post'
import User from '#models/user'
import PostOwnerReactionNotification from '#notifications/post_owner_reaction_notification'
import PostReportingUserStatusNotification from '#notifications/post_reporting_user_status_notification'
import UserPostReportedNotification from '#notifications/user_post_reported_notification'
import UserNotificationService from '#services/user_notification_service'
import { UserService } from '#services/user_service'
import app from '@adonisjs/core/services/app'
import testUtils from '@adonisjs/core/services/test_utils'
import mail from '@adonisjs/mail/services/main'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

test.group('Notification', (group) => {
  let user: User
  let service: UserNotificationService

  group.each.setup(async () => {
    await testUtils.db().truncate()

    user = await UserFactory.with('posts', 1).create()

    service = new UserNotificationService(new UserService())
  })

  group.each.teardown(() => {
    app.container.restoreAll()
  })

  test('Creates a notification of PostOwnerReactionNotification type', async ({ assert }) => {
    const reaction = faker.helpers.enumValue(PostReactionType)
    await user.notify(new PostOwnerReactionNotification(user, user.posts[0], reaction))

    const unreads = await user.unreadNotifications()
    const unreadsJSON = await service.serialize(unreads)

    assert.equal(unreadsJSON.length, 1)
    assert.containsSubset(unreadsJSON[0], {
      data: {
        type: NotificationType.PostOwnerReactionNotification,
        postReactionType: reaction,
        userId: user.id,
      },
      readAt: null,
    })
    assert.properties(unreadsJSON[0], ['id', 'data', 'readAt', 'createdAt', 'updatedAt'])
  })

  test('Creates a notification of PostReportingUserStatusNotification type', async ({
    assert,
    cleanup,
  }) => {
    const { mails } = mail.fake()

    const reportingUser = await UserFactory.with('posts', 1, (post) =>
      post.with('reports', 1, (report) =>
        report.merge({
          userId: user.id,
        })
      )
    ).create()
    const report = reportingUser.posts[0].reports[0]

    await user.notify(new PostReportingUserStatusNotification(report))

    const unreads = await user.unreadNotifications()
    const unreadsJSON = await service.serialize(unreads)

    assert.equal(unreadsJSON.length, 1)
    assert.containsSubset(unreadsJSON[0], {
      data: {
        type: NotificationType.PostReportingUserStatusNotification,
        userId: user.id,
        postId: reportingUser.posts[0].id,
      },
      readAt: null,
    })
    assert.properties(unreadsJSON[0], ['id', 'data', 'readAt', 'createdAt', 'updatedAt'])
    mails.assertSentCount(1)

    cleanup(() => {
      mail.restore()
    })
  })

  test('Creates a notification of UserPostReportedNotification type', async ({
    assert,
    cleanup,
  }) => {
    const { mails } = mail.fake()

    const reportingUser = await UserFactory.with('posts', 1, (post) =>
      post.with('reports', 1, (report) =>
        report.merge({
          userId: user.id,
        })
      )
    ).create()

    const report = reportingUser.posts[0].reports[0]

    await user.notify(new UserPostReportedNotification(report))

    const unreads = await user.unreadNotifications()
    const unreadsJSON = await service.serialize(unreads)

    assert.equal(unreadsJSON.length, 1)
    assert.containsSubset(unreadsJSON[0], {
      data: {
        type: NotificationType.UserPostReportedNotification,
        userId: user.id,
        postId: reportingUser.posts[0].id,
      },
      readAt: null,
    })
    assert.properties(unreadsJSON[0], ['id', 'data', 'readAt', 'createdAt', 'updatedAt'])
    mails.assertSentCount(1)

    cleanup(() => {
      mail.restore()
    })
  })
})
