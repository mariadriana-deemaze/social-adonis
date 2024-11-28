import { ReactElement, useMemo, useState } from 'react'
import { Link } from '@inertiajs/react'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Link as LinkIcon,
  EllipsisVerticalIcon,
  Loader2,
  Pencil,
  Trash2,
  Flag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown_menu'
import { UpdatePost } from '@/components/posts/update'
import { DeletePost } from '@/components/posts/delete'
import { ReportPost } from '@/components/posts/report'
import { UserAvatar } from '@/components/generic/user_avatar'
import PostReactionIcon, { POST_REACTION_ICONS } from '@/components/posts/post_reaction_icon'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover_card'
import { PostResponse } from 'app/interfaces/post'
import { AttachmentResponse } from 'app/interfaces/attachment'
import { formatDistanceToNow } from 'date-fns'
import { PostReactionType } from '#enums/post'
import { UserResponse } from '#interfaces/user'
import { route } from '@izzyjs/route/client'

// NOTE: Would it be better to move this logic to the BE?
function PostContentParser({
  content,
  preview,
  mentions,
}: {
  content: string
  preview: PostResponse['link']
  mentions: PostResponse['mentions']
}) {
  const parsed = useMemo(() => {
    let html = content

    if (preview) {
      html = html.replace(
        preview.link,
        `<a class="text-cyan-600" href=${preview.link} target="_blank">${preview.link}</a>`
      )
    }

    if (mentions) {
      Object.entries(mentions).forEach(([username, info]) => {
        html = html.replace(
          '@' + username,
          `<a class="text-cyan-600" href=${route('users.show', {
            params: {
              id: info.id,
            },
          })}>@${username}</a>`
        )
      })
    }
    return html
  }, [content])
  return (
    <div
      className="pb-5 break-words whitespace-break-spaces post-content"
      dangerouslySetInnerHTML={{ __html: parsed }}
    />
  )
}

function LinkPreview({ preview }: { preview: NonNullable<PostResponse['link']> }) {
  return (
    <div className="flex flex-col lg:flex-row gap-2 h-auto lg:h-48 w-full max-w-[600px] bg-slate-100 hover:bg-slate-200 duration-500 border border-slate-200 p-3 rounded-md">
      <div className="flex flex-row max-w-56 justify-center aspect-auto flex-shrink-0 relative rounded-lg">
        <img
          src={preview.metadata.thumbnail}
          className="z-[1] rounded-lg max-w-full aspect-auto w-60 object-cover"
        />
      </div>
      <div className="relative flex flex-col gap-2 lg:px-5 w-full overflow-hidden">
        <div>
          <h4 className="truncate text-ellipsis font-bold">{preview.metadata.title}</h4>
          <a
            href={preview.link}
            target="_blank"
            className="flex flex-row underline font-medium text-sm text-cyan-600 items-center truncate text-ellipsis"
          >
            <span className="relative">
              <LinkIcon className="h-3" />
            </span>
            {preview.link}
          </a>
        </div>
        <p className="text-sm truncate text-wrap line-clamp-5">{preview.metadata.description}</p>
      </div>
    </div>
  )
}

function PostImage({ image }: { image: AttachmentResponse }) {
  const [loaded, setLoaded] = useState(false)

  const mbSize = useMemo(() => (image.metadata.size / 1048576).toFixed(2), [image])

  return (
    <>
      <div
        className={`absolute flex flex-col bg-slate-900 duration-700 w-full h-full m-auto items-center z-[5] ${loaded ? 'opacity-0' : 'opacity-85'}`}
      >
        <Loader2 className="h-10 w-10 animate-spin text-muted m-auto" />
      </div>
      <div className="group flex flex-row justify-center aspect-auto min-h-[calc(100vh_-_300px)] relative w-full rounded-lg overflow-hidden">
        <div className="opacity-0 group-hover:opacity-100 absolute z-[5] left-2 bottom-2 bg-slate-900 text-white rounded-sm px-2 duration-200">
          <p className="text-sm font-medium">{image.metadata.filename}</p>
          <p className="text-sm">{mbSize} MB</p>
        </div>
        <img
          onLoad={() => setLoaded(true)}
          src={image.link}
          className={`z-[1] rounded-lg w-auto lg:max-h-[700px] duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <img
          src={image.link}
          className={`absolute w-full opacity-50 object-cover blur-md duration-150`}
        />
      </div>
    </>
  )
}

function PostGallery({ attachments }: { attachments: AttachmentResponse[] }) {
  const [imageIndex, setImageIndex] = useState(0)

  function slide(direction: 'left' | 'right') {
    const range = attachments.length - 1

    let next = imageIndex

    if (direction === 'left') {
      next--
    } else {
      next++
    }

    if (next > range) {
      next = 0
    }

    if (next < 0) {
      next = range
    }

    setImageIndex(next)
  }

  return (
    <div>
      <div className="grid gap-4">
        <div className="flex flex-row justify-center border border-slate-300 aspect-auto h-[calc(100vh_-_300px)] max-h-[700px] relative rounded-lg overflow-hidden">
          {attachments.length > 1 && (
            <>
              <Button
                size="icon"
                variant="outline"
                className="absolute left-0 lg:left-5 z-[5] top-[calc(50%_-_20px)] cursor-pointer"
                onClick={() => slide('left')}
              >
                <ArrowLeft />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="absolute right-0 lg:right-5 z-[5] top-[calc(50%_-_20px)] cursor-pointer"
                onClick={() => slide('right')}
              >
                <ArrowRight />
              </Button>
            </>
          )}

          {attachments.map((attachment, index) => (
            <div
              key={`principal_${attachment.id}_${index}`}
              className={`w-full absolute ${index === imageIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <PostImage key={`principal_${attachment.id}_${index}`} image={attachment} />
            </div>
          ))}
        </div>
        {attachments.length > 1 && (
          <div className="flex flex-row gap-4 h-36 w-full overflow-hidden overflow-x-scroll">
            {attachments.map((attachment, index) => (
              <div
                className={`relative overflow-hidden h-36 w-36 rounded-md border ${index === imageIndex && 'border-gray-200'}`}
                key={`${attachment.id}_${index}`}
              >
                <img
                  className="h-auto max-w-full hover:opacity-50 duration-700"
                  src={attachment.link}
                  alt={attachment.metadata.filename}
                  onClick={() => setImageIndex(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PostReaction({
  actions,
  post,
  currentUser,
}: {
  actions: boolean
  post: PostResponse
  currentUser: UserResponse | null
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reaction, setReaction] = useState<{ type: PostReactionType | null; count: number }>({
    type: post.reactions?.reacted,
    count: post.reactions.total,
  })

  const counts = {
    liked: post.reactions.reacted ? post.reactions.total : post.reactions.total + 1,
    unliked: post.reactions.reacted ? post.reactions.total - 1 : post.reactions.total,
  }

  async function reactToPost(react: PostReactionType) {
    if (!currentUser) return
    setIsSubmitting(true)

    const isDelete = react === reaction.type

    const request = await fetch(
      route('posts_reactions.store', { params: { id: post?.id! } }).path,
      {
        method: isDelete ? 'delete' : 'post',
        headers: {
          'content-type': 'application/json',
        },
        ...(!isDelete && {
          body: JSON.stringify({
            reaction: react,
          }),
        }),
      }
    )

    if (request.status === 200 || request.status === 201) {
      setReaction({ type: react, count: counts.liked })
    } else if (request.status === 204) {
      setReaction({ type: null, count: counts.unliked })
    }

    setIsSubmitting(false)
  }

  const countStatus = useMemo(() => {
    if (reaction.type === null) {
      if (reaction.count === 0) {
        return 'No reactions.'
      } else {
        return `${post.reactions.reacted ? post.reactions.total - 1 : post.reactions.total} other reacted.`
      }
    } else {
      if (reaction.count === 1) {
        return `You reacted.`
      } else {
        return `You and ${post.reactions.reacted ? post.reactions.total - 1 : post.reactions.total} other reacted.`
      }
    }
  }, [reaction.type])

  const reactionCounts = useMemo(() => {
    const accCounts = { ...post.reactions.reactionsCounts }
    if (reaction.type && post.reactions.reacted) {
      accCounts[reaction.type] = accCounts[reaction.type] + 1
      accCounts[post.reactions.reacted] = accCounts[post.reactions.reacted] - 1
    } else if (reaction.type && !post.reactions.reacted) {
      accCounts[reaction.type] = accCounts[reaction.type] + 1
    } else if (!reaction.type && post.reactions.reacted) {
      accCounts[post.reactions.reacted] = accCounts[post.reactions.reacted] - 1
    }
    return accCounts
  }, [reaction.type])

  return (
    <div className="flex flex-row gap-2 items-center">
      {actions ? (
        <HoverCard>
          <HoverCardTrigger>
            <button
              className={`trigger-user-post-react border rounded-full px-2 cursor-pointer ${reaction.type ? 'bg-blue-100 border-blue-400 hover:bg-blue-400-200' : 'bg-slate-50 border-slate-400 hover:bg-slate-200'}`}
              disabled={isSubmitting}
            >
              {reaction.type ? <PostReactionIcon type={reaction.type} /> : '+'}
            </button>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            side="top"
            className="flex flex-row divide-x divide-dashed gap-2 px-2 py-1 w-auto"
          >
            {Object.entries(POST_REACTION_ICONS).map(
              ([key, value]: [key: string, value: string]) => (
                <button
                  key={`reaction_${key}`}
                  type="button"
                  className={`react-${key.toLowerCase()} flex flex-row gap-1 p-1 justify-center items-center`}
                  onClick={actions ? () => reactToPost(key as PostReactionType) : () => {}}
                >
                  <p className="text-md hover:scale-110 duration-150">{value}</p>
                  <span className="text-xs text-gray-700">
                    {reactionCounts[key as PostReactionType]}
                  </span>
                </button>
              )
            )}
          </HoverCardContent>
        </HoverCard>
      ) : (
        <button
          className={`border rounded-full cursor-not-allowed px-2 ${reaction.type ? 'bg-blue-100 border-blue-400' : 'bg-slate-50 border-slate-400 '}`}
          disabled={true}
        >
          {reaction.type ? <PostReactionIcon type={reaction.type} /> : '+'}
        </button>
      )}
      <p className="user-post-react-status text-xs text-slate-500">{countStatus}</p>
    </div>
  )
}

function PostActions({
  post,
  abilities,
}: {
  post: PostResponse
  abilities: Partial<Array<'update' | 'delete' | 'report'>>
}) {
  const actions: Record<'update' | 'delete' | 'report', () => ReactElement> = {
    update: () => (
      <UpdatePost
        post={post}
        trigger={
          <div className="flex flex-row gap-3 items-center w-full hover:cursor-pointer">
            <Button className="update-post-trigger" variant="ghost" size="sm-icon">
              <Pencil size={15} />
            </Button>
            <p className="font-normal text-xs text-current">Update</p>
          </div>
        }
      />
    ),
    delete: () => (
      <DeletePost
        post={post}
        trigger={
          <div className="flex flex-row gap-3 items-center w-full hover:cursor-pointer">
            <Button className="delete-post-trigger" variant="ghost" size="sm-icon">
              <Trash2 size={15} />
            </Button>
            <p className="font-normal text-xs text-current">Delete</p>
          </div>
        }
      />
    ),
    report: () => (
      <ReportPost
        post={post}
        trigger={
          <div className="flex flex-row gap-3 items-center w-full hover:cursor-pointer">
            <Button className="report-post-trigger" variant="ghost" size="sm-icon">
              <Flag size={15} />
            </Button>
            <p className="font-normal text-xs text-current">Report</p>
          </div>
        }
      />
    ),
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="trigger-user-post-actions" variant="outline" size="sm-icon">
          <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto" align="end" forceMount>
        {Object.entries(actions).map(([action, Element], index) => {
          if (abilities.includes(action as 'update' | 'delete' | 'report')) {
            return (
              <DropdownMenuItem
                key={`${post.id}_${action}_${index}`}
                className="flex flex-row gap-4 p-0 text-gray-600"
                onSelect={(e) => e.preventDefault()}
                asChild
              >
                <Element />
              </DropdownMenuItem>
            )
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function PostCard({
  post,
  user,
  actions = true,
  redirect = false,
}: {
  post: PostResponse
  user: UserResponse | null
  actions?: boolean
  redirect?: boolean
}) {
  return (
    <article className="flex flex-col w-full border pt-6 px-6 bg-white rounded-sm">
      <div className="flex flex-row pb-3 justify-between border-b border-b-gray-200">
        <Link
          href={
            route('users.show', {
              params: {
                id: post.user.id,
              },
            }).path
          }
        >
          <div className="flex flex-row gap-3">
            <UserAvatar user={post.user} className="h-8 w-8" />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-600 text-ellipsis truncate max-w-40 md:max-w-screen-lg">
                @{post.user.username}
              </p>
              <span className="flex text-xs text-gray-400 gap-1 items-center">
                <Clock size={10} />
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </span>
            </div>
          </div>
        </Link>

        {/* // TODO: Review on how to best manage this, be wise. Explore habilities viewing send from the BE. */}
        {actions && (
          <PostActions
            post={post}
            abilities={post.user.id !== user?.id ? ['report'] : ['update', 'delete']}
          />
        )}
      </div>

      <div className="flex flex-col py-4 gap-4">
        {post.attachments.images.length > 0 && (
          <PostGallery attachments={post.attachments.images} />
        )}

        {redirect ? (
          <Link
            href={
              route('posts.show', {
                params: {
                  id: post.id,
                },
              }).path
            }
          >
            <PostContentParser
              content={post.content}
              preview={post.link}
              mentions={post.mentions}
            />
          </Link>
        ) : (
          <PostContentParser content={post.content} preview={post.link} mentions={post.mentions} />
        )}

        {post.link && <LinkPreview preview={post.link} />}
      </div>

      <div className="py-4 opacity-70 border-t border-t-gray-200">
        <PostReaction actions={actions} post={post} currentUser={user} />
      </div>
    </article>
  )
}
