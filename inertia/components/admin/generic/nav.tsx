import { Link } from '@inertiajs/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown_menu'
import { Button } from '@/components/ui/button'
import AdonisLogo from '@/components/svg/logo'
import { cn } from '@/lib/utils'
import { UserResponse } from '#interfaces/user'
import { route } from '@izzyjs/route/client'
import { PostReportStatus } from '#enums/post'
import { UserAvatar } from '@/components/generic/user_avatar'

export default function NavBar({ user }: { user: UserResponse | null }) {
  const LINKS: Record<'title' | 'link', string>[] = [
    {
      title: 'Home',
      link: route('admin.index').path,
    },
    {
      title: 'Reports',
      link: route('admin_posts_reports.index', {
        qs: { 'status[]': [PostReportStatus.PENDING] },
      }).path,
    },
  ]

  return (
    <div className="fixed top-0 z-10 w-full bg-black">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <nav className={cn('flex items-center space-x-4 lg:space-x-6')}>
            <AdonisLogo className="h-6 w-6 fill-white" />
            {LINKS.map(({ title, link }, index) => (
              <Link
                key={`link-${index}`}
                href={link}
                except={['user']}
                className="text-sm font-medium text-white transition-colors hover:text-primary"
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
                    <UserAvatar user={user} className="h-8 w-8" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name} {user.surname}
                      </p>
                      <p className="truncate text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link as="button" href={route('admin_auth.destroy').path} method="delete">
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
