import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { usePage } from '@inertiajs/react'
import UserNavBar from '@/components/users/nav'
import type { SharedProps } from '@adonisjs/inertia/types'
import favicon from '../../public/assets/images/favicon.svg'
import { UserResponse } from '#interfaces/user'

export default function Layout({ children }: { children: ReactNode }) {
  const { props } = usePage<SharedProps>()

  const user = props.user as UserResponse | null // FIX-ME: Bad practice. Will need to undestand how to lazy call services on the `./config/inertia.ts`

  return (
    <>
      <link rel="icon" type="image/svg+xml" href={favicon} />
      <UserNavBar user={user} />
      <div className="container flex justify-start pt-20">{children}</div>
      <Toaster />
    </>
  )
}
