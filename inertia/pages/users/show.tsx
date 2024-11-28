import { useState } from 'react'
import FeedController from '#controllers/feed_controller'
import FeedList from '@/components/posts/feed_list'
import { Card, CardContent } from '@/components/ui/card'
import { InferPageProps } from '@adonisjs/inertia/types'
import { lightFormat } from 'date-fns'
import { Head } from '@inertiajs/react'
import { CalendarHeart, FilePen } from 'lucide-react'
import { CreatePost } from '@/components/posts/create'
import { UserResponse } from '#interfaces/user'
import { route } from '@izzyjs/route/client'
import { UserAvatar } from '@/components/generic/user_avatar'
import { cn } from '@/lib/utils'

function UserCard({ user, totalPosts }: { user: UserResponse; totalPosts: number }) {
  return (
    <Card className="user-profile-card sticky top-20 flex flex-row w-full align-middle rounded-b-sm rounded-t-none lg:rounded-sm">
      <CardContent className="relative w-full flex flex-col text-center p-3 lg:p-1 pt-2 divide-y divide-dashed">
        <div className="relative w-auto lg:w-full flex flex-row lg:flex-col gap-4 self-center lg:self-start items-center pb-2 mt-8 mb-2 lg:py-5 lg:px-2 lg:my-0">
          <div className="absolute lg:relative -top-32 lg:top-0 w-full flex flex-row justify-center gap-3">
            <UserAvatar
              user={user}
              className="h-28 w-28 lg:h-20 lg:w-20 border-4 border-white shadow-lg"
            />
          </div>
          <div>
            <h4 className="text-md">{user.name}</h4>
            <p className="text-xs max-w-fit truncate text-ellipsis text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full pt-2 pb-0 lg:p-3 justify-center">
          <div className="flex w-full p-1 justify-center">
            <div className="flex flex-row gap-2 items-center">
              <FilePen className="w-4 text-gray-400" />
              <p className="user-profile-card-total-posts text-xs lg:text-sm">
                Total posts
                <span className="text-muted-foreground"> {totalPosts}</span>
              </p>
            </div>
          </div>

          <div className="flex w-full p-1 justify-center">
            <div className="flex flex-row gap-2 items-center">
              <CalendarHeart className="w-4 text-gray-400" />
              <p className="text-xs lg:text-sm">
                Joined on
                <span className="text-muted-foreground">
                  {' '}
                  {lightFormat(new Date(user.createdAt), 'yyyy-MM-dd')}
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Show({ user, posts, profile }: InferPageProps<FeedController, 'show'>) {
  const [coverLoadState, setCoverLoadState] = useState<'loading' | 'loaded'>('loading')
  if (!posts || !profile) return <>Loading..</>
  return (
    <>
      <Head title={`@${profile.username}`} />
      <div className="relative min-h-[280px] lg:min-h-max w-full mb-16 lg:mb-0">
        <div className="relative bg-slate-300 border border-gray-200 h-52 w-full rounded-2xl mb-4 shadow-inner">
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <img
              onLoad={() => setCoverLoadState('loaded')}
              className={cn(
                'w-full h-full object-cover overflow',
                coverLoadState === 'loaded' ? 'block animate-in fade-in duration-1000' : 'hidden'
              )}
              src={profile.attachments.cover?.link}
            />
          </div>
          <div className="absolute block lg:hidden -bottom-28 w-full">
            <UserCard user={profile} totalPosts={posts.meta.total} />
          </div>
        </div>
      </div>
      <div className="relative flex flex-col lg:flex-row gap-2 w-full">
        <div className="hidden lg:block h-full w-full max-w-full lg:max-w-64">
          <UserCard user={profile} totalPosts={posts.meta.total} />
        </div>
        <div className="w-full">
          <FeedList
            url={route('users.show', { params: { id: profile?.id! } }).path}
            currentUser={user}
            posts={posts}
          />
          {user?.id === profile.id && (
            <div className="z-10 fixed left-5 bottom-5">
              <CreatePost />
            </div>
          )}
          {/*  <ScrollTop /> */}
        </div>
      </div>
    </>
  )
}
