import { ReactNode, Suspense } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { usePage } from '@inertiajs/react'
import UserNavBar from '@/components/users/nav'
import Footer from '@/components/generic/footer'
import favicon from '../../public/assets/images/favicon.svg'
import type { SharedProps } from '@adonisjs/inertia/types'

export default function Layout({ children }: { children: ReactNode }) {
  const {
    props: { user },
  } = usePage<SharedProps>()
  return (
    <Suspense fallback={<>Loading...</>}>
      <div>
        <link rel="icon" type="image/svg+xml" href={favicon} />
        <UserNavBar user={user} />
        <main className="relative z-[1] border-b bg-[#F7F8FA] shadow-2xl shadow-blue-100/70">
          <div className="container relative z-[1] m-auto mt-20 flex max-w-screen-lg justify-start">
            {children}
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Suspense>
  )
}
