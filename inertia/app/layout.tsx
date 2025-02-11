import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { usePage } from '@inertiajs/react'
import UserNavBar from '@/components/users/nav'
import favicon from '../../public/assets/images/favicon.svg'
import type { SharedProps } from '@adonisjs/inertia/types'

export default function Layout({ children }: { children: ReactNode }) {
  const {
    props: { user },
  } = usePage<SharedProps>()
  return (
    <>
      <link rel="icon" type="image/svg+xml" href={favicon} />
      <UserNavBar user={user} />
      <div className="container mt-20 flex justify-start">{children}</div>
      <Toaster />
    </>
  )
}
