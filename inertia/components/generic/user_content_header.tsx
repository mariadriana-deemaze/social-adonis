import { UserResponse } from '#interfaces/user'
import { UserAvatar } from '@/components/generic/user_avatar'
import { formatDistanceToNow } from 'date-fns'
import { BadgeCheck, Clock } from 'lucide-react'

export function UserContentHeader({ user, createdAt }: { user: UserResponse; createdAt: string }) {
  return (
    <div className="flex flex-row gap-3">
      <UserAvatar user={user} className="h-8 w-8" />
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2">
          <p className="max-w-40 truncate text-ellipsis text-xs font-semibold text-gray-600 md:max-w-screen-lg">
            {user.fullname ?? `@${user.username}`}
          </p>
          {user.verified && <BadgeCheck size={14} className="fill-blue-500 stroke-white" />}
        </div>
        <span className="flex flex-row items-center gap-2 text-xs text-gray-400">
          <Clock size={10} />
          {formatDistanceToNow(new Date(createdAt))} ago
        </span>
      </div>
    </div>
  )
}
