import { Head } from '@inertiajs/react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function SignIn() {
  const signIn = async () => {
    const req = await fetch('/auth/sign-in', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testing@gmail.com',
        password: 'password',
      }),
    })

    const response = await req.json()

    console.log('response ->', response)
  }

  return (
    <>
      <Head title="Homepage" />
      <div className="container gap-4">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>Enter your account authentication credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button onClick={signIn} className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't yet have an account?{' '}
              <a href="/auth/sign-up" className="underline">
                Sign up
              </a>
            </div>
          </CardContent>
        </Card>

        <a href="/posts" className="underline">
          Try to get posts
        </a>
      </div>
    </>
  )
}
