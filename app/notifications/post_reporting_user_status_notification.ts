import {
  NotificationChannelName,
  NotificationContract,
  PostReportingUserStatusNotificationData,
} from '@osenco/adonisjs-notifications/types'
import { PostReportStatus } from '#enums/post'
import PostReportingUserStatusMail from '#mails/post_reporting_user_status_mail'
import { NotificationType } from '#enums/notification'
import type User from '#models/user'
import type PostReport from '#models/post_report'

export default class PostReportingUserStatusNotification implements NotificationContract<User> {
  private readonly report
  protected subject = ''
  protected message = ''

  constructor(report: PostReport) {
    this.report = report
    this.#templateData()
  }

  via(notifiable: User): NotificationChannelName | Array<NotificationChannelName> {
    return notifiable.notificationPreference
  }

  toDatabase(notifiable: User): PostReportingUserStatusNotificationData {
    return {
      type: NotificationType.PostReportingUserStatusNotification,
      userId: notifiable.id,
      postId: this.report.postId,
      title: this.subject,
      message: this.message,
    }
  }

  toMail(notifiable: User) {
    return new PostReportingUserStatusMail(notifiable, this.report)
  }

  #templateData() {
    this.subject = `Thank you for the report on the post :postId.`
    this.message =
      `We wanted to let you know that we have taken action in the reported content.
    ${
      this.report.status === PostReportStatus.ACCEPTED
        ? `We have found the claims to be true, so the reported post has been hidden from 
        the feed.`
        : `We have found the claims to be false.`
    }
    ` + 'Thank you for helping us keep the community safe.'
  }
}
