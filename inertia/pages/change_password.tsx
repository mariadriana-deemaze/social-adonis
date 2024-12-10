import { useEffect } from 'react'
import { router, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use_toast'
import AdonisLogo from '@/components/svg/logo'
import { route } from '@izzyjs/route/client'
import HeadOG from '@/components/generic/head_og'
import { InferPageProps } from '@adonisjs/inertia/types'
import AuthController from '#controllers/auth_controller'

export default function ResetPassword({ queryParams }: InferPageProps<AuthController, 'update'>) {
  const { toast } = useToast()

  const { data, setData, post, processing, errors } = useForm({
    password: '',
    passwordConfirmation: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(
      route('auth.update', {
        qs: { token: queryParams.token },
      }).path
    )
  }

  useEffect(() => {
    if (Object.entries(errors).length) {
      toast({ title: 'Error resetting password.', description: errors.password })
    }
  }, [errors])

  useEffect(() => {
    if (queryParams.token) {
      toast({ title: 'Error acessing route', description: 'Invalid request.' })
      return router.visit(route('auth.show').path)
    }
  }, [])

  return (
    <>
      <HeadOG
        title="Change password"
        description="Update the password of your social adonis account."
        url={route('auth.update').path}
      />
      <div className="container gap-10">
        <AdonisLogo />
        <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
          <Card className="w-full lg:mx-auto lg:max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Change password</CardTitle>
              <CardDescription>Update your account authentication credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
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
                <div className="grid gap-2">
                  <Label htmlFor="password-confirmation">Confirm password</Label>
                  <Input
                    id="password-confirmation"
                    type="password"
                    value={data.passwordConfirmation}
                    onChange={(e) => setData('passwordConfirmation', e.target.value)}
                    RightSlot
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    processing ||
                    (data.password.length === 0 && data.passwordConfirmation.length === 0)
                  }
                >
                  Recover
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  )
}
