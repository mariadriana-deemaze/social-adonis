import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { usePage } from '@inertiajs/react'
import UserNavBar from '@/components/users/nav'
import type { SharedProps } from '@adonisjs/inertia/types'

export default function Layout({ children }: { children: ReactNode }) {
  const {
    props: { user },
  } = usePage<SharedProps>()

  return (
    <>
      {user && <UserNavBar user={user} />}
      <div className="container flex justify-start">{children}</div>
      <Toaster />
    </>
  )
}
