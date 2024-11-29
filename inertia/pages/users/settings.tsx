import UsersController from '#controllers/users_controller'
import { UserResponse } from '#interfaces/user'
import HeadOG from '@/components/generic/head_og'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use_toast'
import { cn } from '@/lib/utils'
import { InferPageProps } from '@adonisjs/inertia/types'
import { useForm, usePage } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'
import { AtSign, Upload } from 'lucide-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

export default function UserSettings({
  user,
}: InferPageProps<UsersController, 'show'> & { user: UserResponse }) {
  const [avatarLoadState, setAvatarLoadState] = useState<'loading' | 'loaded'>('loading')
  const [coverLoadState, setCoverLoadState] = useState<'loading' | 'loaded'>('loading')
  const [avatarPreview, setAvatarPreview] = useState(
    () => user.attachments.avatar?.link || undefined
  )
  const [coverPreview, setCoverPreview] = useState(() => user.attachments.cover?.link || undefined)
  const [deleteIntentModal, setDeleteIntentModal] = useState(false)

  if (!user) return <></>

  const { props } = usePage()

  const { toast } = useToast()

  const {
    data,
    setData,
    patch,
    delete: deleteReq,
    processing,
  } = useForm<{
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
    patch(route('users.update').path, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast({ title: 'Success!' })
      },
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

  function deleteAccount() {
    deleteReq(route('users.destroy').path, {
      preserveState: true,
      preserveScroll: true,
      data: undefined,
      onSuccess: () => {
        toast({ title: 'Account succesfully deleted.' })
      },
    })
  }

  useEffect(() => {
    if (props?.errors && Object.entries(props.errors).length) {
      toast({ title: props?.errors.message || 'Error updating profile details.' })
    }
  }, [props?.errors])

  return (
    <>
      <HeadOG
        title={`${user.username} Setting's`}
        description="Your profile settings on Social Adonis."
        url={route('settings.show').path}
      />
      <div className="relative flex w-full flex-col items-center gap-4 pb-5 pt-0">
        <form className="flex w-full flex-col items-center gap-4" onSubmit={handleSubmit}>
          <div className="relative mb-20 h-64 w-full rounded-2xl bg-slate-300 shadow-inner">
            <div className="h-full w-full overflow-hidden rounded-2xl">
              {coverPreview && (
                <img
                  src={coverPreview}
                  onLoad={() => setCoverLoadState('loaded')}
                  className={cn(
                    'overflow h-full w-full rounded-lg object-cover',
                    coverLoadState === 'loaded'
                      ? 'block duration-1000 animate-in fade-in'
                      : 'hidden'
                  )}
                />
              )}
            </div>

            <div className="absolute -bottom-10 left-[calc(50%_-_62px)] h-32 w-32">
              <div className="relative h-full w-full">
                <Avatar className="h-32 w-32 shadow-lg">
                  <AvatarImage
                    src={avatarPreview}
                    alt={`${user.name} avatar image`}
                    onLoad={() => setAvatarLoadState('loaded')}
                    className={cn(
                      avatarLoadState === 'loaded'
                        ? 'block duration-1000 animate-in fade-in'
                        : 'hidden'
                    )}
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
                  onChange={onAvatarChange}
                />
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
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
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    error={props?.errors?.name}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Family name"
                    value={data.surname}
                    onChange={(e) => setData('surname', e.target.value)}
                    error={props?.errors?.surname}
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
                    error={props?.errors?.email}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={data.username}
                    onChange={(e) => setData('username', e.target.value)}
                    error={props?.errors?.username}
                    LeftSlot={() => <AtSign size={18} className="text-gray-400" />}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={processing}>
                Update
              </Button>
            </CardContent>
          </Card>
        </form>

        <Card className="flex w-full max-w-screen-md flex-col items-center justify-between border-red-100 bg-gray-100 lg:flex-row">
          <CardHeader className="text-wrap text-center lg:text-left">
            <CardTitle className="text-md">Danger zone</CardTitle>
            <CardDescription>Permanently delete account.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col lg:pb-0">
            <Dialog open={deleteIntentModal} onOpenChange={setDeleteIntentModal}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="trigger-delete-account w-52">
                  Delete account
                </Button>
              </DialogTrigger>
              <DialogContent className="default-dialog">
                <DialogHeader>
                  <DialogTitle>Delete account</DialogTitle>
                  <DialogDescription>Confirm deletion</DialogDescription>
                </DialogHeader>
                <p className="text-center text-sm">
                  This is a non-reversible action. Everything related to your account, as well as
                  your connections and content will be lost forever - into the void.
                </p>
                <div className="flex w-full flex-row justify-center gap-4">
                  <Button onClick={() => setDeleteIntentModal(false)} type="button">
                    Cancel
                  </Button>
                  <Button
                    className="delete-account"
                    type="button"
                    onClick={deleteAccount}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
