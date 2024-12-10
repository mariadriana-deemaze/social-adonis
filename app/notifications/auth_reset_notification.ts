import { NotificationChannelName, NotificationContract } from '@osenco/adonisjs-notifications/types'
import type User from '#models/user'
import ResetAccessMail from '#mails/reset_access_mail'

export default class AuthResetNotification implements NotificationContract<User> {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  via(): NotificationChannelName | Array<NotificationChannelName> {
    return 'mail'
  }

  toMail(notifiable: User) {
    return new ResetAccessMail(notifiable, this.token)
  }
}
