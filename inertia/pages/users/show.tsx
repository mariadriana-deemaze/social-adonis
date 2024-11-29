import { useEffect, useState } from 'react'
import FeedController from '#controllers/feed_controller'
import HeadOG from '@/components/generic/head_og'
import FeedList from '@/components/posts/feed_list'
import { Card, CardContent } from '@/components/ui/card'
import { InferPageProps } from '@adonisjs/inertia/types'
import { lightFormat } from 'date-fns'
import { BadgeCheck, CalendarHeart, FilePen, UserCheck } from 'lucide-react'
import { CreatePost } from '@/components/posts/create'
import { UserResponse } from '#interfaces/user'
import { route } from '@izzyjs/route/client'
import { UserAvatar } from '@/components/generic/user_avatar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function UserCard({
  currentUser,
  user,
  totalPosts,
  follow,
  setProfileData,
  setFollow,
}: {
  currentUser: UserResponse | null
  user: UserResponse
  totalPosts: number
  follow: 'following' | 'not-following' | null
  setProfileData: React.Dispatch<React.SetStateAction<UserResponse>>
  setFollow: React.Dispatch<React.SetStateAction<'following' | 'not-following' | null>>
}) {
  async function followUser() {
    const url = route('users_follows.store', {
      params: {
        userId: user.id,
      },
    }).path

    if (follow === 'following') {
      fetch(url, {
        method: 'delete',
      }).then(() => {
        setFollow('not-following')
        setProfileData((prevState) => {
          return { ...prevState, followersCount: +prevState.followersCount - 1 }
        })
      })
    } else {
      fetch(url, {
        method: 'post',
      }).then(() => {
        setFollow('following')
        setProfileData((prevState) => {
          return { ...prevState, followersCount: +prevState.followersCount + 1 }
        })
      })
    }
  }

  return (
    <Card className="user-profile-card sticky top-20 flex w-full flex-row rounded-b-sm rounded-t-none align-middle lg:rounded-sm">
      <CardContent className="relative flex w-full flex-col divide-y divide-dashed p-3 pt-2 text-center lg:p-1">
        <div className="relative mb-2 mt-8 flex w-auto flex-row items-center gap-4 self-center pb-2 lg:my-0 lg:w-full lg:flex-col lg:self-start lg:px-2 lg:py-5">
          <div className="absolute -top-32 flex w-full flex-row justify-center gap-3 lg:relative lg:top-0">
            <UserAvatar
              user={user}
              className="h-28 w-28 border-4 border-white shadow-lg lg:h-20 lg:w-20"
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center justify-center gap-1">
              <h4 className="text-md max-w-72 truncate text-ellipsis lg:max-w-40">{user.name}</h4>
              {user.verified && <BadgeCheck size={16} className="fill-blue-500 stroke-white" />}
            </div>
            <p className="max-w-72 truncate text-ellipsis text-xs text-muted-foreground lg:max-w-40">
              @{user.username}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center gap-3 pb-0 pt-2 lg:p-3">
          {!!currentUser && currentUser.id !== user.id && (
            <Button
              className="follow-action"
              size="sm"
              type="button"
              onClick={followUser}
              disabled={follow === null}
            >
              {follow === 'following' && 'Unfollow'}
              {(follow === 'not-following' || follow === null) && 'Follow'}
            </Button>
          )}

          {/* // TODO: Refactor UI */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-center gap-2">
              <UserCheck className="w-4 text-gray-400" />
              <p className="user-profile-card-total-followers text-xs lg:text-sm">
                Followers
                <span className="text-muted-foreground"> {user.followersCount}</span>
              </p>
            </div>

            <div className="flex flex-row items-center justify-center gap-2">
              <FilePen className="w-4 text-gray-400" />
              <p className="user-profile-card-total-posts text-xs lg:text-sm">
                Total posts
                <span className="text-muted-foreground"> {totalPosts}</span>
              </p>
            </div>

            <div className="flex flex-row items-center justify-center gap-2">
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
  if (!posts || !profile) return <>Loading..</>
  const [userData, setUserData] = useState<UserResponse>(profile)
  const [follow, setFollow] = useState<'following' | 'not-following' | null>(null)
  const [coverLoadState, setCoverLoadState] = useState<'loading' | 'loaded'>('loading')

  async function followStatus() {
    if (!profile) return
    const request = await fetch(
      route('users_follows.show', {
        params: {
          userId: profile.id,
        },
      }).path
    )

    if (request.ok) {
      const json: { following: boolean } = await request.json()
      if (json.following) {
        setFollow('following')
      } else {
        setFollow('not-following')
      }
    }
  }

  useEffect(() => {
    followStatus()
  }, [])

  return (
    <>
      <HeadOG
        title={`@${profile.username}`}
        description={`Discover ${profile.username} on Social Adonis.`}
        image={profile.attachments.avatar?.link}
        url={
          route('users.show', {
            params: {
              id: profile.id,
            },
          }).path
        }
      />
      <div className="relative mb-16 min-h-[340px] w-full lg:mb-0 lg:min-h-max">
        <div className="relative mb-4 h-52 w-full rounded-2xl border border-gray-200 bg-slate-300 shadow-inner">
          <div className="h-full w-full overflow-hidden rounded-2xl">
            <img
              onLoad={() => setCoverLoadState('loaded')}
              className={cn(
                'overflow h-full w-full object-cover',
                coverLoadState === 'loaded' ? 'block duration-1000 animate-in fade-in' : 'hidden'
              )}
              src={profile.attachments.cover?.link}
            />
          </div>
          <div className="absolute -bottom-44 block w-full lg:hidden">
            <UserCard
              currentUser={user}
              user={userData}
              totalPosts={posts.meta.total}
              setProfileData={setUserData}
              follow={follow}
              setFollow={setFollow}
            />
          </div>
        </div>
      </div>
      <div className="relative flex w-full flex-col gap-2 lg:flex-row">
        <div className="hidden h-full w-full max-w-full lg:block lg:max-w-64">
          <UserCard
            currentUser={user}
            user={userData}
            totalPosts={posts.meta.total}
            setProfileData={setUserData}
            follow={follow}
            setFollow={setFollow}
          />
        </div>
        <div className="w-full">
          <FeedList
            url={route('users.show', { params: { id: profile?.id! } }).path}
            currentUser={user}
            posts={posts}
          />
          {user?.id === profile.id && (
            <div className="fixed bottom-5 left-5 z-10">
              <CreatePost />
            </div>
          )}
          {/*  <ScrollTop /> */}
        </div>
      </div>
    </>
  )
}
