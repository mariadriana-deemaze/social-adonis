import { Head, useForm } from '@inertiajs/react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function SignIn() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/auth/sign-in', {
      onSuccess: () => console.log('profit?'),
    })
  }

  return (
    <>
      <Head title="Homepage" />
      <form className="container" onSubmit={handleSubmit}>
        {processing && 'Hold up!'}
        {errors && JSON.stringify(errors)}
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
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={data.email}
                    //@ts-ignore
                    onChange={(e) => setData('email', e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    //@ts-ignore
                    onChange={(e) => setData('password', e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
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
      </form>
    </>
  )
}
