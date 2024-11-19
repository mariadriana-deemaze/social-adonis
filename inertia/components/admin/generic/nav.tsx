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
import { cn } from '@/lib/utils'
import { UserResponse } from '#interfaces/user'
import { PostReportStatus } from '#enums/post'

export default function NavBar({ user }: { user: UserResponse | null }) {
  const LINKS: Record<'title' | 'link', string>[] = [
    {
      title: 'Home',
      link: '/admin/index',
    },
    {
      title: 'Reports',
      // FIX-ME: izzy.
      link: `/admin/posts/reports?status[]=${PostReportStatus.PENDING}`,
    },
  ]

  return (
    <div className="fixed top-0 bg-black w-full z-10">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <nav className={cn('flex items-center space-x-4 lg:space-x-6')}>
            <AdonisLogo className="h-6 w-6 fill-white" />
            {LINKS.map(({ title, link }, index) => (
              <Link
                key={`link-${index}`}
                href={link}
                except={['user']}
                className="text-white text-sm font-medium transition-colors hover:text-primary"
              >
                {title}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            {user ? (
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
                      <Link href={`/users/${user.id}`}>Profile</Link>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/users/${user.id}/settings`}>Settings</Link>
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link as="button" href={'/admin/auth/sign-out'} method="delete">
                      Log out
                    </Link>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
