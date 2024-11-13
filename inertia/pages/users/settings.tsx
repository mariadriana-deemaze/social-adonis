import UsersController from '#controllers/users_controller'
import { UserResponse } from '#interfaces/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import { Upload } from 'lucide-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

export default function UserSettings({
  user,
}: InferPageProps<UsersController, 'show'> & { user: UserResponse }) {
  const [avatarPreview, setAvatarPreview] = useState(
    () => user.attachments.avatar?.link || undefined
  )
  const [coverPreview, setCoverPreview] = useState(() => user.attachments.cover?.link || undefined)

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
      preserveState: true,
      preserveScroll: true,
    })
  }

  function onAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return
    setData('avatar', e.target.files[0])

    const fileReader = new FileReader()
    fileReader.onload = () => {
      const { result } = fileReader
      if (!result) return
      setAvatarPreview(String(result))
    }
    fileReader.readAsDataURL(e.target.files[0])
  }

  function onCoverChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return
    setData('cover', e.target.files[0])

    const fileReader = new FileReader()
    fileReader.onload = () => {
      const { result } = fileReader
      if (!result) return
      setCoverPreview(String(result))
    }
    fileReader.readAsDataURL(e.target.files[0])
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
              {coverPreview && (
                <img
                  className="w-full h-full object-cover rounded-lg overflow"
                  src={coverPreview}
                />
              )}
            </div>

            <div className="absolute h-32 w-32 left-[calc(50%_-_62px)] -bottom-10">
              <div className="relative w-full h-full">
                <Avatar className="h-32 w-32 shadow-lg">
                  <AvatarImage src={avatarPreview} alt={`${user.name} avatar image`} />
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
                  onChange={onAvatarChange}
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
                onChange={onCoverChange}
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
                  {props?.errors?.name && (
                    <p className="text-red-600 text-xs">{props?.errors?.name}</p>
                  )}
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
                  {props?.errors?.surname && (
                    <p className="text-red-600 text-xs">{props?.errors?.surname}</p>
                  )}
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
