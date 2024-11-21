import { renderToStaticMarkup } from 'react-dom/server'
import PlatformBaseMailNotification from '#mails/base'
import Template from '#mails/templates/user_post_reported_mail'
import PostReport from '#models/post_report'
import User from '#models/user'

export default class UserPostReportedMail extends PlatformBaseMailNotification {
  constructor(notifiable: User, report: PostReport) {
    super(notifiable, {
      subject: 'Notice of blocked content',
      body: renderToStaticMarkup(<Template user={notifiable} report={report} />),
    })
  }
}
