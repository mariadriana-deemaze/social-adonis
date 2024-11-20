import { NotificationChannelName, NotificationContract } from '@osenco/adonisjs-notifications/types'
import { PostReportStatus } from '#enums/post'
import type User from '#models/user'
import type PostReport from '#models/post_report'
import { NotificationData } from '#interfaces/notification'

export default class PostReportingUserStatusNotification implements NotificationContract<User> {
  private readonly report

  constructor(report: PostReport) {
    this.report = report
  }

  via(notifiable: User): NotificationChannelName | Array<NotificationChannelName> {
    return notifiable.notificationPreference
  }

  toDatabase(notifiable: User): NotificationData {
    return {
      user: notifiable,
      title: `Thank you for the report on the post ${this.report.post.id}.`,
      message:
        `We wanted to let you know that we have taken action in the reported content.
      ${
        this.report.status === PostReportStatus.ACCEPTED
          ? `We have found the claims to be true, so the reported post has been hidden from 
          the feed.`
          : `We have found the claims to be false.`
      }
      ` + 'Thank you for helping us keep the community safe.',
    }
  }
}
