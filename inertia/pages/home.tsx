import { Head, Link } from '@inertiajs/react'
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
          <Link href="auth/sign-in">psst... sign in here</Link>
        </Button>
      </div>
    </>
  )
}
