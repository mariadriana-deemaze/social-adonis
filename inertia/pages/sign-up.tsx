import { useEffect } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useToast } from '../components/ui/use-toast'
import { Toaster } from '../components/ui/toaster'

export default function SignUp() {
  const { toast } = useToast()

  const { data, setData, post, processing, errors } = useForm({
    fullName: '',
    email: '',
    password: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/auth/sign-up')
  }

  useEffect(() => {
    if (Object.entries(errors).length) {
      toast({ title: 'Error on signing up.', description: errors.email && errors.email[0] })
    }
  }, [errors])

  return (
    <>
      <Head title="Homepage" />
      <form className="container" onSubmit={handleSubmit}>
        <div className="container gap-4">
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={data.fullName}
                    onChange={(e) => setData('fullName', e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={data.email}
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
                    onChange={(e) => setData('password', e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                  Create an account
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <a href="/auth/sign-in" className="underline">
                  Sign in
                </a>
              </div>
            </CardContent>
          </Card>
          <a href="/posts" className="underline">
            Try to get posts
          </a>
        </div>
      </form>
      <Toaster />
    </>
  )
}
