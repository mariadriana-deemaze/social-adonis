import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { SharedProps } from '@adonisjs/inertia/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import { Upload } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function UserSettings({ user }: SharedProps) {
  if (!user) return <></>

  const { props } = usePage()

  const { toast } = useToast()

  const { data, setData, patch, processing } = useForm<{
    name: string
    surname: string
    username: string
    email: string
    avatar: File | null
    cover: File | null
  }>({
    name: user.name ?? '',
    surname: user.surname ?? '',
    username: user.username,
    email: user.email,
    avatar: null,
    cover: null,
  })

  const uploadAvatar = useRef<HTMLInputElement>(null)
  const uploadCover = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    patch(`/users/${user?.id}`, {
      preserveState: false,
      preserveScroll: true,
    })
  }

  useEffect(() => {
    if (props?.errors && Object.entries(props.errors).length) {
      toast({ title: 'Error updating profile details.' })
    }
  }, [props?.errors])

  return (
    <>
      <Head title={`Social Adonis | ${user.username} Setting's`} />
      <div className="relative flex flex-col pt-0 w-full">
        <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleSubmit}>
          <div className="relative bg-slate-300 h-64 w-full rounded-2xl mb-20 shadow-inner">
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-lg overflow"
                src="https://socialadonisweb.s3.eu-north-1.amazonaws.com/uploads/Image/cu8dzs2a4svkvpbmoy6mw45q.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARFAXXG6LR2ZE7KLB%2F20241112%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241112T171721Z&X-Amz-Expires=1800&X-Amz-Signature=c78316cd70ab2b795f1d42d92d5cc0e7adb87c9886788d33087978d6662d0840&X-Amz-SignedHeaders=host&x-id=GetObject"
              />
            </div>

            <div className="absolute h-32 w-32 left-[calc(50%_-_62px)] -bottom-10">
              <div className="relative w-full h-full">
                <Avatar className="h-32 w-32 shadow-lg">
                  <AvatarImage
                    //src="https://socialadonisweb.s3.eu-north-1.amazonaws.com/uploads/Image/cu8dzs2a4svkvpbmoy6mw45q.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARFAXXG6LR2ZE7KLB%2F20241112%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241112T142906Z&X-Amz-Expires=1800&X-Amz-Signature=f728c7a3362b4bef1b616c058c88d9ea302aa3df96c29588b7aa8ba706d24cff&X-Amz-SignedHeaders=host&x-id=GetObject"
                    src="https://avatars.githubusercontent.com/u/97130795?v=4"
                    alt={`${user.name} avatar image`}
                  />
                  <AvatarFallback>{user.name ? user.name[0] : '-'}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  onClick={() => uploadAvatar.current?.click()}
                  className="absolute bottom-0 right-0"
                  size="sm-icon"
                >
                  <Upload size={16} />
                </Button>
                <input
                  ref={uploadAvatar}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files || !e.target.files[0]) return
                    setData('avatar', e.target.files[0])
                  }}
                />
              </div>
            </div>
            <div className="absolute right-2 bottom-2">
              <input
                ref={uploadCover}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (!e.target.files || !e.target.files[0]) return
                  setData('cover', e.target.files[0])
                }}
              />
              <Button
                type="button"
                onClick={() => uploadCover.current?.click()}
                className="absolute bottom-0 right-0"
                size="sm-icon"
              >
                <Upload size={16} />
              </Button>
            </div>
          </div>

          <Card className="w-full max-w-screen-md">
            <CardHeader>
              <CardTitle className="text-xl">Account profile</CardTitle>
              <CardDescription>Update your account profile details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Surname</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Family name"
                    value={data.surname}
                    onChange={(e) => setData('surname', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john_doe@example.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                  />
                  {props?.errors?.email && (
                    <p className="text-red-600 text-xs">{props?.errors?.email}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={data.username}
                    onChange={(e) => setData('username', e.target.value)}
                  />
                  {props?.errors?.username && (
                    <p className="text-red-600 text-xs">{props?.errors?.username}</p>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={processing}>
                Update
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  )
}
