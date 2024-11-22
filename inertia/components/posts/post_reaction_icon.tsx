import { PostReactionType } from '#enums/post'
import { cn } from '@/lib/utils'

export const POST_REACTION_ICONS: Record<PostReactionType, string> = {
  [PostReactionType.LIKE]: '👍',
  [PostReactionType.THANKFUL]: '🙌',
  [PostReactionType.FUNNY]: '🤣',
  [PostReactionType.CONGRATULATIONS]: '🎉',
  [PostReactionType.ANGRY]: '😡',
  [PostReactionType.LOVE]: '😍',
}

export default function PostReactionIcon({
  type,
  className,
}: {
  type: PostReactionType
  className?: HTMLSpanElement['className']
}) {
  return <span className={cn('h-4 w-4', className)}>{POST_REACTION_ICONS[type]}</span>
}
