import PlatformBaseMailNotification from '#mails/base'
import template from '#mails/templates/post_reporting_user_status_mail'
import PostReport from '#models/post_report'
import User from '#models/user'

export default class PostReportingUserStatusMail extends PlatformBaseMailNotification {
  constructor(notifiable: User, report: PostReport) {
    super(notifiable, {
      subject: 'Following up on your content report',
      body: template({
        user: notifiable,
        report,
      }),
    })
  }
}
