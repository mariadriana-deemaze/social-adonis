import { useEffect } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use_toast'
import AdonisLogo from '@/components/svg/logo'
import { route } from '@izzyjs/route/client'
import HeadOG from '@/components/generic/head_og'
import { InferPageProps, SharedProps } from '@adonisjs/inertia/types'
import AuthController from '#controllers/auth_controller'
import SocialButtons from '@/components/generic/social_buttons'

export default function SignIn({
  notification,
}: InferPageProps<AuthController, 'show'> & SharedProps) {
  const { toast } = useToast()

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(route('auth.show').path)
  }

  useEffect(() => {
    if (Object.entries(errors).length) {
      toast({ title: 'Error signing in.', description: errors.email })
    }
  }, [errors])

  useEffect(() => {
    if (Object.entries(notification).length) {
      toast({ title: notification.message })
    }
  }, [notification])

  return (
    <>
      <HeadOG
        title="Sign in"
        description="Sign in to social adonis."
        url={route('auth.show').path}
      />
      <div className="container gap-10">
        <AdonisLogo />
        <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
          <Card className="w-full lg:mx-auto lg:max-w-sm">
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
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    RightSlot
                  />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                  Login
                </Button>

                <SocialButtons disabled={processing} />
              </div>
              <div className="mt-4 text-center text-sm leading-7">
                <p>
                  Don't yet have an account?{' '}
                  <Link href={route('auth.store').path} className="underline">
                    Sign up
                  </Link>
                </p>
                <p>
                  <Link
                    href={route('auth.reset').path}
                    className="mt-4 text-center text-sm underline"
                  >
                    Forgotten password?
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  )
}
