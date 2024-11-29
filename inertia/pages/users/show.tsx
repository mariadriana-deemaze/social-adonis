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
    <Card className="user-profile-card sticky top-20 flex flex-row w-full align-middle rounded-b-sm rounded-t-none lg:rounded-sm">
      <CardContent className="relative w-full flex flex-col text-center p-3 lg:p-1 pt-2 divide-y divide-dashed">
        <div className="relative w-auto lg:w-full flex flex-row lg:flex-col gap-4 self-center lg:self-start items-center pb-2 mt-8 mb-2 lg:py-5 lg:px-2 lg:my-0">
          <div className="absolute lg:relative -top-32 lg:top-0 w-full flex flex-row justify-center gap-3">
            <UserAvatar
              user={user}
              className="h-28 w-28 lg:h-20 lg:w-20 border-4 border-white shadow-lg"
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-row gap-1 items-center justify-center">
              <h4 className="text-md text-ellipsis truncate max-w-72 lg:max-w-40">{user.name}</h4>
              {user.verified && <BadgeCheck size={16} className="fill-blue-500 stroke-white" />}
            </div>
            <p className="text-xs max-w-72 lg:max-w-40 truncate text-ellipsis text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full pt-2 pb-0 lg:p-3 justify-center">
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
          <div className="flex w-full p-1 justify-center">
            <div className="flex flex-row gap-2 items-center">
              <UserCheck className="w-4 text-gray-400" />
              <p className="user-profile-card-total-followers text-xs lg:text-sm">
                Followers
                <span className="text-muted-foreground">{user.followersCount}</span>
              </p>
            </div>
          </div>

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
  if (!posts || !profile) return <>Loading..</>
  const [userData, setUserData] = useState<UserResponse>(profile)
  const [follow, setFollow] = useState<'following' | 'not-following' | null>(null)
  const [coverLoadState, setCoverLoadState] = useState<'loading' | 'loaded'>('loading')

  async function followStatus() {
    if (!user) return
    const request = await fetch(
      route('users_follows.show', {
        params: {
          userId: user.id,
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
      <div className="relative flex flex-col lg:flex-row gap-2 w-full">
        <div className="hidden lg:block h-full w-full max-w-full lg:max-w-64">
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
