import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <>
      <Head title="Homepage" />
      <div className="container gap-8">
        <div className="title">Landing page I guess</div>
        <Button variant="outline">
          <Link href="auth/sign-in">psst... sign in here</Link>
        </Button>
      </div>
    </>
  )
}
