import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { usePage } from '@inertiajs/react'
import favicon from '../../public/assets/images/favicon.svg'
import type { SharedProps } from '@adonisjs/inertia/types'
import NavBar from '@/components/admin/generic/nav'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const {
    props: { user },
  } = usePage<SharedProps>()
  return (
    <>
      <link rel="icon" type="image/svg+xml" href={favicon} />
      <NavBar user={user} />
      <div className="flex flex-col justify-start pt-20">{children}</div>
      <Toaster />
    </>
  )
}
