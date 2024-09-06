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
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function UserNavBar({ user }: { user: { id: number; name?: string } }) {
  return (
    <div className="sticky top-0 bg-white w-full">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <nav className={cn('flex items-center space-x-4 lg:space-x-6')}>
            <Link href="/feed" className="text-sm font-medium transition-colors hover:text-primary">
              Feed
            </Link>
            <Link
              href="/groups"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Groups
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="#" alt={`${user.name} avatar image`}/>
                    <AvatarFallback>{user.name ? user.name[0] : '-'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">shadcn</p>
                    <p className="text-xs leading-none text-muted-foreground">m@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>New Team</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
