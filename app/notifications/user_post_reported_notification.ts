import {
  NotificationChannelName,
  NotificationContract,
  UserPostReportedNotificationData,
} from '@osenco/adonisjs-notifications/types'
import UserPostReportedMail from '#mails/user_post_reported_mail'
import { NotificationType } from '#enums/notification'
import type User from '#models/user'
import type PostReport from '#models/post_report'

export default class UserPostReportedNotification implements NotificationContract<User> {
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

  toDatabase(notifiable: User): UserPostReportedNotificationData {
    return {
      type: NotificationType.UserPostReportedNotification,
      userId: notifiable.id,
      postId: this.report.postId,
      title: this.subject,
      message: this.message,
    }
  }

  toMail(notifiable: User) {
    return new UserPostReportedMail(notifiable, this.report)
  }

  #templateData() {
    this.subject = `Notice on blocked content.`
    this.message = `We wanted to let you know that we have taken action in blocking the post :postId, 
      as it's content has been reported by other users, and the content moderation has prooceeded in it's favour.`
  }
}
