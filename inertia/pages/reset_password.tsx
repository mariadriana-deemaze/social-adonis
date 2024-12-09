import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use_toast'
import AdonisLogo from '@/components/svg/logo'
import { route } from '@izzyjs/route/client'
import HeadOG from '@/components/generic/head_og'

export default function ResetPassword() {
  const { toast } = useToast()

  const { data, setData, post, processing, errors } = useForm({
    email: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(route('auth.reset').path)
  }

  useEffect(() => {
    if (Object.entries(errors).length) {
      toast({ title: 'Error resetting password.', description: errors.email })
    }
  }, [errors])

  return (
    <>
      <HeadOG
        title="Reset password"
        description="Restore access to your social adonis account."
        url={route('auth.reset').path}
      />
      <div className="container gap-10">
        <AdonisLogo />
        <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
          <Card className="w-full lg:mx-auto lg:max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Reset password</CardTitle>
              <CardDescription>Restore your account authentication credentials</CardDescription>
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
                <Button type="submit" className="w-full" disabled={processing}>
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
