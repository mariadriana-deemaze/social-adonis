import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { usePage } from '@inertiajs/react'
import UserNavBar from '@/components/users/nav'
import type { SharedProps } from '@adonisjs/inertia/types'
import favicon from '../../public/assets/images/favicon.svg'

export default function Layout({ children }: { children: ReactNode }) {
  const {
    props: { user },
  } = usePage<SharedProps>()
  return (
    <>
      <link rel="icon" type="image/svg+xml" href={favicon} />
      <UserNavBar user={user} />
      <div className="container flex justify-start pt-20">{children}</div>
      <Toaster />
    </>
  )
}
