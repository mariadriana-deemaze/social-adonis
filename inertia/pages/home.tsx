import { Head, Link } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'
import { Button } from '@/components/ui/button'
import AdonisLogo from '@/components/svg/logo'

export default function Home() {
  return (
    <>
      <Head title="Homepage" />
      <div className="container gap-8">
        <AdonisLogo />
        <div className="title">Landing page</div>
        <Button variant="outline">
          <Link href={route('auth.show').path}>psst... sign in here</Link>
        </Button>
      </div>
    </>
  )
}
