import { PostReportStatus } from '#enums/post'
import PostReport from '#models/post_report'
import User from '#models/user'

export default function template({ user, report }: { user: User; report: PostReport }) {
  return `
  <h1>
  Hello ${user.name},
  </h1>
  <p>
  Custom template for post_reporting_user_status_mail. User: ${user.id} ${user.name}
  </p>
  <p>
  We wanted to let you know that we have taken action in the reported content.
    ${
      report.status === PostReportStatus.ACCEPTED
        ? `We have found the claims to be true, so the reported post has been hidden from 
        the feed.`
        : `We have found the claims to be false.` +
          'Thank you for helping us keep the community safe.'
    }
  </p>
  `
}
