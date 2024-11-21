import PostReport from '#models/post_report'
import User from '#models/user'

export default function template({ user, report }: { user: User; report: PostReport }) {
  return `<h1>
     Hello ${user.name},
     </h1>

     <p>
     Custom template for user_post_reported_mail.
     </p>
      <p>
      We wanted to let you know that we have taken action in blocking the ${report.post.id}, 
      as it's content has been reported by other users, and the content moderation has prooceeded in it's favour.
      </p>`
}
