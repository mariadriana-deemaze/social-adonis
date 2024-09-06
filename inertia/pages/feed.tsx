import { Head } from '@inertiajs/react'
import { Toaster } from '@/components/ui/toaster'
import { useEffect } from 'react'
import UserNavBar from '@/components/users/nav'

export default function Feed(props: unknown) {
  useEffect(() => {
    console.log('props ->', props)
  }, [props])

  return (
    <>
      <Head title="SocialAdonis | Feed" />
      <UserNavBar user={{ id: 1, name: 'Hello' }} />
      <div className="container gap-4">Feed me!</div>
      <Toaster />
    </>
  )
}
