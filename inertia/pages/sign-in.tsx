import { useEffect } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function SignIn() {
  const { toast } = useToast()

  const { data, setData, post, processing, errors } = useForm({
    email: 'admin_user@gmail.com',
    password: 'take1WildGuess!',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/auth/sign-in')
  }

  useEffect(() => {
    if (Object.entries(errors).length) {
      toast({ title: 'Error on signing in.', description: 'Check the fields.' })
    }
  }, [errors])

  return (
    <>
      <Head title="Social Adonis | Sign in" />
      <form className="container" onSubmit={handleSubmit}>
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
                    onChange={(e) => setData('email', e.target.value)}
                    required
                  />
                  {errors.email && <p className="text-red-600">{errors.email}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                  />
                  {errors.password && <p className="text-red-600">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don't yet have an account?{' '}
                <Link href="/auth/sign-up" className="underline">
                  Sign up
                </Link>
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
