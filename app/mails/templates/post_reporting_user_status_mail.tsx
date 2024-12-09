import { PostReportStatus } from '#enums/post'
import PostReport from '#models/post_report'
import User from '#models/user'
import { route } from '@izzyjs/route/client'
// FIX-ME: Getting import errors `app/app/...` - app appended twice.
// import { Button } from '@/components/ui/button'
// import AdonisLogo from '../../../inertia/components/svg/logo'
// import { Button } from '../../../inertia/components/ui/button'

const hr = 'bg-gray-100 my-5'
const paragraph = 'text-sm text-slate-400 text-left'

const baseUrl = process.env['PRODUCTION_URL'] || 'https://social-adonis.fly.dev'
export default function Template({ user, report }: { user: User; report: PostReport }) {
  return (
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com" />
      </head>

      <body
        style={{
          backgroundColor: '#f6f9fc',
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
        }}
      >
        {/* <AdonisLogo /> */}
        <a href={route('home.show').path}>
          <svg className="h-16 w-16 fill-primary" viewBox="0 0 33 33">
            <path
              fillRule="evenodd"
              d="M0 16.333c0 13.173 3.16 16.333 16.333 16.333 13.173 0 16.333-3.16 16.333-16.333C32.666 3.16 29.506 0 16.333 0 3.16 0 0 3.16 0 16.333Zm6.586 3.393L11.71 8.083c.865-1.962 2.528-3.027 4.624-3.027 2.096 0 3.759 1.065 4.624 3.027l5.123 11.643c.233.566.432 1.297.432 1.93 0 2.893-2.029 4.923-4.923 4.923-.986 0-1.769-.252-2.561-.506-.812-.261-1.634-.526-2.695-.526-1.048 0-1.89.267-2.718.529-.801.253-1.59.503-2.538.503-2.894 0-4.923-2.03-4.923-4.924 0-.632.2-1.363.432-1.929Zm9.747-9.613-5.056 11.443c1.497-.699 3.227-1.032 5.056-1.032 1.763 0 3.56.333 4.99 1.032l-4.99-11.444Z"
              clipRule="evenodd"
            />
          </svg>
        </a>

        <hr className="my-5 bg-gray-100" />

        <p className={paragraph}>
          Hello {user.name} {user.surname},
        </p>
        <p className={paragraph}>
          We wanted to let you know that we have taken action in the reported content.
          {report.status === PostReportStatus.ACCEPTED
            ? `We have found the claims to be true, so the reported post has been hidden from 
      the feed.`
            : `We have found the claims to be false.` +
              'Thank you for helping us keep the community safe.'}
        </p>

        <button className="h-10 rounded-md bg-blue-500 text-white">
          <a href={route('users.show', { params: { id: user.id } }).path}>View your page</a>
        </button>

        {/* // FOOTER partial */}
        <p className={paragraph}>
          We'll be here to help you with any step along the way. You can find answers to most
          questions and get in touch with us on our{' '}
          <a className="text-blue-500" href={baseUrl}>
            support site
          </a>
          .
        </p>
        <p className={paragraph}>— The Social Adonis team</p>
        <hr className={hr} />
        <p className="text-xs text-cyan-200">
          Social Adonis, 354 Oyster Point Blvd, South San Francisco, CA 94080
        </p>
      </body>
    </html>
  )
}
