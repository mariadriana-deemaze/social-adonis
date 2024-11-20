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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import AdonisLogo from '@/components/svg/logo'
import { cn } from '@/lib/utils'
import { UserResponse } from '#interfaces/user'
import { route } from '@izzyjs/route/client'
import { PostReportStatus } from '#enums/post'

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
