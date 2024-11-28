import { UserResponse } from '#interfaces/user'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export const UserAvatar = ({ user, className }: { user: UserResponse; className?: string }) => {
  const [avatarLoadState, setAvatarLoadState] = useState<'loading' | 'loaded'>('loading')
  return (
    <Avatar className={cn('h-6 w-6', className)}>
      <AvatarImage
        onLoad={() => setAvatarLoadState('loaded')}
        src={user?.attachments ? user?.attachments?.avatar?.link : '#'}
        alt={`${user.fullname}'s avatar image`}
        className={cn(
          avatarLoadState === 'loaded' ? 'block animate-in fade-in duration-1000' : 'hidden'
        )}
      />
      <AvatarFallback>{user.fullname[0] || '-'}</AvatarFallback>
    </Avatar>
  )
}
