import { renderToStaticMarkup } from 'react-dom/server'
import PlatformBaseMailNotification from '#mails/base'
import PostReport from '#models/post_report'
import User from '#models/user'
import Template from '#mails/templates/post_reporting_user_status_mail'

export default class PostReportingUserStatusMail extends PlatformBaseMailNotification {
  constructor(notifiable: User, report: PostReport) {
    super(notifiable, {
      subject: 'Following up on your content report',
      body: renderToStaticMarkup(<Template user={notifiable} report={report} />),
    })
  }
}
