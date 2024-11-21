import { useEffect, useMemo, useState } from 'react'
import { route } from '@izzyjs/route/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown_menu'
import { NotificationResponse } from '#interfaces/notification'
import { BellDot, CheckCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import InfoPanel from '@/components/generic/info_panel'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function NotificationsDropdown() {
  const [notificationsLoadState, setNotificationsLoadState] = useState<
    'loading' | 'loaded' | 'error'
  >('loading')
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [markedAsRead, setMarkedAsRead] = useState(false)

  async function getUserNotifications() {
    const request = await fetch(route('notifications.index').path, { method: 'GET' })
    if (request.ok) {
      const data: NotificationResponse[] = await request.json()
      setNotifications(data)
      setNotificationsLoadState('loaded')
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
              <div className="absolute animate-in duration-700 right-[1px] top-[2.5px] h-2 w-2 bg-blue-500 rounded-full" />
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
                  <p className="text-sm">Mark all as read</p>
                  <Button
                    className="bg-gray-100 hover:bg-gray-200 border border-gray-200"
                    size="sm-icon"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck size={16} className="text-gray-400" />
                  </Button>
                </div>

                <hr className="w-full bg-gray-50" />

                {notifications.map((notification) => {
                  return (
                    <div
                      key={notification.user.id}
                      className="flex flex-row gap-4 p-2 overflow-hidden hover:bg-gray-50 rounded-md"
                    >
                      <div className="flex flex-col gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              notification.user?.attachments
                                ? notification.user?.attachments?.avatar?.link
                                : '#'
                            }
                            alt={`${notification.user.name} avatar image`}
                          />
                          <AvatarFallback>
                            {notification.user.name ? notification.user.name[0] : '-'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col gap-1">
                        <a
                          href={
                            route('users.show', {
                              params: { id: notification.user.id },
                            }).path
                          }
                          className="text-xs font-semibold text-blue-500 hover:text-blue-400"
                        >
                          @{notification.user.username}
                        </a>
                        {/* TODO: Improve UX - a link here could be useful, depending on the type. Maybe the link could be sent by the server, as well as we could store the type of notification */}
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold truncate line-clamp-1 text-ellipsis text-wrap">
                            {notification.data.title}
                          </p>
                          <p className="text-sm truncate line-clamp-2 text-ellipsis text-wrap">
                            {notification.data.message}
                          </p>
                        </div>
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
