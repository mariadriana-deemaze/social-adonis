import { Link } from '@inertiajs/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown_menu'
import { Button } from '@/components/ui/button'
import AdonisLogo from '@/components/svg/logo'
import { UserResponse } from '#interfaces/user'
import { cn } from '@/lib/utils'
import { route } from '@izzyjs/route/client'
import NotificationsDropdown from '@/components/users/_notifications_dropdown'
import { UserAvatar } from '@/components/generic/user_avatar'

export default function UserNavBar({ user }: { user: UserResponse | null }) {
  const LINKS: Record<'title' | 'link', string>[] = [
    {
      title: 'Home',
      link: route('home.show').path,
    },
    {
      title: 'Feed',
      link: route('feed.show').path,
    },
  ]

  return (
    <div className="fixed top-0 bg-white w-full z-10">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <nav className={cn('flex items-center space-x-4 lg:space-x-6')}>
            <AdonisLogo className="h-6 w-6" />
            {LINKS.map(({ title, link }, index) => (
              <Link
                key={`link-${index}`}
                href={link}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {title}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <div>
              {user ? (
                <div className="flex flex-row gap-3">
                  <NotificationsDropdown />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <UserAvatar user={user} className="h-8 w-8" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.fullname}</p>
                          <p className="text-xs truncate leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="flex content-center relative cursor-pointer"
                          asChild
                        >
                          <Link
                            className="flex flex-row items-center relative w-full"
                            href={route('users.show', { params: { id: user?.id! } }).path}
                          >
                            Profile
                            <DropdownMenuShortcut className="absolute right-0">
                              ⇧⌘P
                            </DropdownMenuShortcut>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex content-center relative cursor-pointer"
                          asChild
                        >
                          <Link
                            className="flex flex-row items-center relative w-full"
                            href={route('settings.show', { params: { id: user?.id! } }).path}
                          >
                            Settings
                            <DropdownMenuShortcut className="absolute right-0">
                              ⌘S
                            </DropdownMenuShortcut>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex content-center relative cursor-pointer"
                        asChild
                      >
                        <Link
                          className="flex flex-row items-center relative w-full"
                          as="button"
                          href={route('auth.destroy').path}
                          method="delete"
                        >
                          Log out
                          <DropdownMenuShortcut className="absolute right-0">
                            ⇧⌘Q
                          </DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link href={route('auth.show').path}>
                  <Button size="sm">Sign in</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
