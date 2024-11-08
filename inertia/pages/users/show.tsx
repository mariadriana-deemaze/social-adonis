import UsersController from '#controllers/users_controller'
import FeedList from '@/components/posts/feed-list'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { InferPageProps } from '@adonisjs/inertia/types'
import { lightFormat } from 'date-fns'
import { Head } from '@inertiajs/react'
import { CalendarHeart, FilePen } from 'lucide-react'
import { CreatePost } from '@/components/posts/create'

export default function Show({ user, posts, profile }: InferPageProps<UsersController, 'show'>) {
  if (!posts || !profile) return <>Loading..</>
  return (
    <>
      <Head title={`SocialAdonis | @${profile.username}`} />
      <div className="relative flex flex-col lg:flex-row gap-2 w-full">
        <div className="h-full w-full max-w-full lg:max-w-96">
          <Card className="user-profile-card sticky top-20 flex flex-row w-full align-middle rounded-sm">
            <CardContent className="relative w-full flex flex-col text-center pt-5 divide-y divide-dashed">
              <div className="relative w-full flex flex-col gap-4 items-center p-5">
                <div className="flex flex-row gap-3">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="#" alt={`${profile.name} avatar image`} />
                    <AvatarFallback>{profile.name ? profile.name[0] : '-'}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h4 className="text-md">{profile.name}</h4>
                  <p className="text-xs max-w-28 truncate text-ellipsis text-muted-foreground">
                    @{profile.username}
                  </p>
                </div>
              </div>

              <div className="flex flex-col w-full p-3 justify-center">
                <div className="flex w-full p-1 justify-center">
                  <div className="flex flex-row gap-2 items-center">
                    <FilePen className="w-4 text-gray-400" />
                    <p className="user-profile-card-total-posts text-sm">
                      Total posts
                      <span className="text-muted-foreground"> {posts?.meta?.total}</span>
                    </p>
                  </div>
                </div>

                <div className="flex w-full p-1 justify-center">
                  <div className="flex flex-row gap-2 items-center">
                    <CalendarHeart className="w-4 text-gray-400" />
                    <p className="text-sm">
                      Joined on
                      <span className="text-muted-foreground">
                        {' '}
                        {lightFormat(new Date(profile.createdAt), 'yyyy-MM-dd')}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {user?.id === profile.id && (
                <div className="flex w-full pt-5 justify-center">
                  <CreatePost />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="w-full">
          <FeedList url={`/users/${profile.id}`} currentUser={user} posts={posts} />
        </div>
      </div>
    </>
  )
}
