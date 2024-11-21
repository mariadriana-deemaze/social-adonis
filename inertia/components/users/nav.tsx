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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import AdonisLogo from '@/components/svg/logo'
import { UserResponse } from '#interfaces/user'
import { cn } from '@/lib/utils'
import { route } from '@izzyjs/route/client'
import NotificationsDropdown from '@/components/users/_notifications_dropdown'

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
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user?.attachments ? user?.attachments?.avatar?.link : '#'}
                            alt={`${user.name} avatar image`}
                          />
                          <AvatarFallback>{user.name ? user.name[0] : '-'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.name} {user.surname}
                          </p>
                          <p className="text-xs truncate leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Link href={route('users.show', { params: { id: user?.id! } }).path}>
                            Profile
                          </Link>
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={route('settings.show', { params: { id: user?.id! } }).path}>
                            Settings
                          </Link>
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link as="button" href={route('auth.destroy').path} method="delete">
                          Log out
                        </Link>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
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
