import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'

export default class PlatformBaseMailNotification extends BaseMail {
  subject = 'Social Adonis'
  body = ''

  constructor(
    private user: User,
    params: { subject: string; body: string }
  ) {
    super()
    Object.assign(this, {
      subject: this.subject + ' | ' + params.subject,
      body: params.body,
    })
  }

  prepare() {
    this.message.subject(this.subject).to(this.user.email).html(this.body)
  }
}
