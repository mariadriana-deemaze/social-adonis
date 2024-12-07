import { useEffect, useMemo, useState } from 'react'
import { route } from '@izzyjs/route/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown_menu'
import { Button } from '@/components/ui/button'
import InfoPanel from '@/components/generic/info_panel'
import PostReactionIcon from '@/components/posts/post_reaction_icon'
import { UserAvatar } from '@/components/generic/user_avatar'
import { Link } from '@inertiajs/react'
import { NotificationResponse } from '#interfaces/notification'
import { BadgeInfo, BellDot, CheckCheck, Clock, Loader2 } from 'lucide-react'
import { NotificationType } from '#enums/notification'
import { PostReactionType } from '#enums/post'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationsDropdown() {
  const [notificationsLoadState, setNotificationsLoadState] = useState<
    'loading' | 'loaded' | 'error'
  >('loading')
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [markedAsRead, setMarkedAsRead] = useState(false)

  const INFO_TYPES = [
    NotificationType.PostReportingUserStatusNotification,
    NotificationType.UserPostReportedNotification,
  ]

  async function getUserNotifications() {
    const request = await fetch(route('notifications.index').path, { method: 'GET' })
    if (request.ok) {
      const data: NotificationResponse[] = await request.json()
      if (data.length !== notifications.length) {
        setNotifications(data)
        setNotificationsLoadState('loaded')
      }
    } else {
      setNotificationsLoadState('error')
    }
  }

  async function markAllAsRead() {
    const request = await fetch(route('notifications.update').path, { method: 'POST' })
    if (request.ok) {
      setNotifications([])
      setMarkedAsRead(true)
    }
  }

  const hasNotifications = useMemo(
    () => notificationsLoadState === 'loaded' && notifications.length > 0,
    [notificationsLoadState, notifications]
  )

  useEffect(() => {
    getUserNotifications()
    // TODO: Future, implement as broadcast.
    const iter = setInterval(getUserNotifications, 1000 * 10)
    return () => clearInterval(iter)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
          <div className="relative">
            {hasNotifications && (
              <div className="flex justify-center absolute bg-white right-0 top-[1px] h-3 w-3 rounded-full">
                <div className="self-center absolute animate-in duration-700 h-1 w-1 bg-blue-500 rounded-full" />
                <div className="self-center absolute animate-pulse duration-1000 h-2 w-2 bg-blue-500 rounded-full opacity-20" />
              </div>
            )}
            <BellDot size={20} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-0" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col py-1">
            <p className="text-sm font-medium leading-none">
              Unread notifications{' '}
              {notifications.length > 0 && (
                <span className="ml-1 bg-gray-100 w-10 h-8 px-2 rounded-lg text-xs font-bold text-gray-500">
                  {notifications.length}
                </span>
              )}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="flex flex-col gap-2 p-2 items-center">
          {notificationsLoadState === 'loading' && (
            <div className="p-5">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            </div>
          )}

          {notificationsLoadState === 'error' && (
            <InfoPanel type="error" title="Something went wrong. Try again at a later time." />
          )}

          {notificationsLoadState === 'loaded' &&
            (notifications.length > 0 ? (
              <>
                <div className="px-2 w-full flex flex-row gap-3 items-center justify-between">
                  <p className="text-xs">Mark all as read</p>
                  <Button
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-100 h-6 w-6"
                    size="sm-icon"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck size={16} className="text-gray-400" />
                  </Button>
                </div>

                <hr className="w-full bg-gray-50" />

                {notifications.map((notification) => {
                  // Later eval if it makes sense to have this on the client, or on the server
                  const link = route('posts.show', {
                    params: {
                      id: notification.data.postId,
                    },
                  }).path

                  return (
                    <div
                      key={notification.data.user.id}
                      className="flex flex-row gap-4 p-2 overflow-hidden hover:bg-gray-50 rounded-md"
                    >
                      <div className="flex flex-col gap-2">
                        {INFO_TYPES.includes(notification.data.type) ? (
                          <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <BadgeInfo size={22} className="text-white" />
                          </div>
                        ) : (
                          <div className="relative h-8 w-8">
                            <UserAvatar user={notification.data.user} className="h-8 w-8" />
                            {notification.data.type ===
                              NotificationType.PostOwnerReactionNotification && (
                              <div className="absolute p-0 m-0 -bottom-2 -right-2 h-5 w-5 rounded-full bg-white border border-white">
                                <PostReactionIcon
                                  type={notification.data.postReactionType as PostReactionType}
                                  className="absolute bottom-1 right-[1px]"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <a
                          href={
                            route('users.show', {
                              params: { id: notification.data.user.id },
                            }).path
                          }
                          className="text-xs font-semibold text-blue-500 hover:text-blue-400"
                        >
                          @{notification.data.user.username}
                        </a>
                        {/* TODO: Improve UX - a link here could be useful, depending on the type. Maybe the link could be sent by the server, as well as we could store the type of notification */}
                        <div className="flex flex-col">
                          <p className="text-xs font-semibold truncate line-clamp-2 text-ellipsis text-wrap">
                            {notification.data.title}
                          </p>
                          <p className="text-xs truncate line-clamp-2 text-ellipsis text-wrap">
                            <Link href={link}>{notification.data.message}</Link>
                          </p>
                        </div>
                        <span className="flex text-xs text-gray-400 gap-1 items-center">
                          <Clock size={10} />
                          {formatDistanceToNow(
                            new Date(notification.updatedAt || notification.createdAt)
                          )}{' '}
                          ago
                        </span>
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              <div className="p-5">
                <p className="text-sm">
                  {markedAsRead ? 'All caught up! ✌️' : 'Nothing to see here. 🍃'}
                </p>
              </div>
            ))}
        </div>
        <div className="text-center px-5 py-1 w-full border-t border-t-gray-100 bg-gray-50 cursor-not-allowed">
          {/*  // TODO: Notificatons page */}
          <a href="#" className="text-sm text-gray-700 pointer-events-none">
            See all activity
          </a>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
