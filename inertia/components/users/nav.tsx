import { Link } from '@inertiajs/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown_menu'
import { Button } from '@/components/ui/button'
import AdonisLogo from '@/components/svg/logo'
import { UserResponse } from '#interfaces/user'
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
    <nav className="fixed top-0 z-10 w-screen border-b bg-white">
      <div className="m-auto flex h-16 max-w-screen-lg items-center justify-center gap-6 px-4 align-middle">
        <AdonisLogo />
        <ul className="flex w-full justify-center gap-8 text-center">
          {LINKS.map(({ title, link }, index) => (
            <li key={`link-${index}`}>
              <Link
                href={link}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center space-x-4">
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
                      <p className="truncate text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="relative flex cursor-pointer content-center"
                      asChild
                    >
                      <Link
                        className="relative flex w-full flex-row items-center"
                        href={route('users.show', { params: { id: user?.id! } }).path}
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="relative flex cursor-pointer content-center"
                      asChild
                    >
                      <Link
                        className="relative flex w-full flex-row items-center"
                        href={route('settings.show').path}
                      >
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="relative flex cursor-pointer content-center" asChild>
                    <Link
                      className="relative flex w-full flex-row items-center"
                      as="button"
                      href={route('auth.destroy').path}
                      method="delete"
                    >
                      Log out
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
    </nav>
  )
}
