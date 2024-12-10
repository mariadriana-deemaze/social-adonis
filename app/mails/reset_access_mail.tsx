import { renderToStaticMarkup } from 'react-dom/server'
import PlatformBaseMailNotification from '#mails/base'
import Template from '#mails/templates/reset_access_mail'
import User from '#models/user'

export default class ResetAccessMail extends PlatformBaseMailNotification {
  constructor(notifiable: User, token: string) {
    super(notifiable, {
      subject: 'Account access reset',
      body: renderToStaticMarkup(<Template user={notifiable} token={token} />),
    })
  }
}
