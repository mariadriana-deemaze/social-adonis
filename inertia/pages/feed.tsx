import { Head } from '@inertiajs/react'
import User from '#models/user'

export default function Feed({ user }: { user: User | null }) {
  return (
    <>
      <Head title="SocialAdonis | Feed" />
      <div className="container">
        <p className='flex flex-wrap'>User feed for {user?.id}</p>
      </div>
    </>
  )
}
