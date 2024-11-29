import { Link } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'
import { Button } from '@/components/ui/button'
import AdonisLogo from '@/components/svg/logo'
import HeadOG from '@/components/generic/head_og'

export default function Home() {
  return (
    <>
      <HeadOG
        title="Homepage"
        description="Homepage of social adonis."
        url={route('home.show').path}
      />
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
