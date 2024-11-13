import FeedController from '#controllers/feed_controller'
import FeedList from '@/components/posts/feed-list'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { InferPageProps } from '@adonisjs/inertia/types'
import { lightFormat } from 'date-fns'
import { Head } from '@inertiajs/react'
import { CalendarHeart, FilePen } from 'lucide-react'
import { CreatePost } from '@/components/posts/create'

export default function Show({ user, posts, profile }: InferPageProps<FeedController, 'show'>) {
  if (!posts || !profile) return <>Loading..</>
  return (
    <>
      <Head title={`SocialAdonis | @${profile.username}`} />

      {/*  // TODO: Place cover */}
      {/* <div className="relative bg-slate-300 h-64 w-full rounded-2xl mb-10 shadow-inner">
        <div className="w-full h-full rounded-2xl overflow-hidden">
          <img
            className="w-full h-full object-cover rounded-lg overflow"
            src="https://socialadonisweb.s3.eu-north-1.amazonaws.com/uploads/Image/cu8dzs2a4svkvpbmoy6mw45q.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARFAXXG6LR2ZE7KLB%2F20241112%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241112T171721Z&X-Amz-Expires=1800&X-Amz-Signature=c78316cd70ab2b795f1d42d92d5cc0e7adb87c9886788d33087978d6662d0840&X-Amz-SignedHeaders=host&x-id=GetObject"
          />
        </div>
      </div> */}
      <div className="relative flex flex-col lg:flex-row gap-2 w-full">
        <div className="h-full w-full max-w-full lg:max-w-72">
          {/* TODO: Make sticky on mobile scroll, as a nav. */}
          <Card className="user-profile-card sticky top-20 flex flex-row w-full align-middle rounded-sm">
            <CardContent className="relative w-full flex flex-col text-center pt-5 divide-y divide-dashed">
              <div className="relative w-full flex flex-col gap-4 items-center p-5">
                <div className="flex flex-row gap-3">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={profile.attachments.avatar?.link}
                      alt={`${profile.name} avatar image`}
                    />
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

              <div className="flex flex-col w-full p-3 pb-0 justify-center">
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
            </CardContent>
          </Card>
        </div>
        <div className="w-full">
          <FeedList url={`/users/${profile.id}`} currentUser={user} posts={posts} />

          {user?.id === profile.id && (
            <div className="z-10 fixed left-5 bottom-5">
              <CreatePost />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
