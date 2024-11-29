import { useEffect } from 'react'
import { Link, useForm } from '@inertiajs/react'
import HeadOG from '@/components/generic/head_og'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use_toast'
import AdonisLogo from '@/components/svg/logo'
import { route } from '@izzyjs/route/client'

export default function SignUp() {
  const { toast } = useToast()

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/auth/sign-up')
  }

  useEffect(() => {
    if (Object.entries(errors).length) {
      toast({ title: 'Error on signing up.', description: 'Check the fields.' })
    }
  }, [errors])

  return (
    <>
      <HeadOG
        title="Sign up"
        description="Sign up to social adonis."
        url={route('auth.store').path}
      />
      <div className="container gap-10">
        <AdonisLogo />
        <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
          <Card className="w-full lg:mx-auto lg:max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">First name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    error={errors.name}
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
                    error={errors.email}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={data.passwordConfirmation}
                    onChange={(e) => setData('passwordConfirmation', e.target.value)}
                    error={errors.passwordConfirmation}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                  Create an account
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href={route('auth.show').path} className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  )
}
