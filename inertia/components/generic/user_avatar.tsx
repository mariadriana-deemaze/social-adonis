import { UserResponse } from '#interfaces/user'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export const UserAvatar = ({ user, className }: { user: UserResponse; className?: string }) => (
  <Avatar className={cn('h-6 w-6', className)}>
    <AvatarImage
      src={user?.attachments ? user?.attachments?.avatar?.link : '#'}
      alt={`${user.fullname}'s avatar image`}
    />
    <AvatarFallback>{user.fullname[0] || '-'}</AvatarFallback>
  </Avatar>
)
