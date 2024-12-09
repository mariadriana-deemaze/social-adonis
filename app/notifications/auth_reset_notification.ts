import { NotificationChannelName, NotificationContract } from '@osenco/adonisjs-notifications/types'
import type User from '#models/user'

export default class AuthResetNotification implements NotificationContract<User> {
  private user: User
  private token: string

  protected subject = ''
  protected message = ''

  constructor(user: User, token: string) {
    this.user = user
    this.token = token
    this.#templateData()
  }

  via(): NotificationChannelName | Array<NotificationChannelName> {
    return 'mail'
  }

  #templateData() {
    this.subject = `Hello @${this.user.username}`
    this.message =
      `We wanted to let you know that we have taken action in the reported content. ${this.token}` // TODO: Continue
  }
}
