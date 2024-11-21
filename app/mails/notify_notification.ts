import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'

export default class PlatformMailNotification extends BaseMail {
  from = 'info@social-adonis.com'
  subject = ''
  body = ''

  constructor(
    private user: User,
    params: { subject: string; body: string }
  ) {
    super()
    Object.assign(this, params)
  }

  prepare() {
    this.message.subject(this.subject).from(this.from).to(this.user.email).html(this.body)
  }
}
