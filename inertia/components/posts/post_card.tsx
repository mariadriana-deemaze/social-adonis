import { Dispatch, ReactElement, SetStateAction, useMemo, useState } from 'react'
import axios from 'axios'
import {
  ArrowLeft,
  ArrowRight,
  Link as LinkIcon,
  EllipsisVerticalIcon,
  Loader2,
  Pencil,
  Trash2,
  Flag,
  Pin,
  MessageSquareMore,
} from 'lucide-react'
import { Link } from '@inertiajs/react'
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
import PostReactionIcon, { POST_REACTION_ICONS } from '@/components/posts/post_reaction_icon'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover_card'
import { PostResponse } from 'app/interfaces/post'
import { AttachmentResponse } from 'app/interfaces/attachment'
import { PostReactionType } from '#enums/post'
import { UserResponse } from '#interfaces/user'
import { route } from '@izzyjs/route/client'
import { useToast } from '@/components/ui/use_toast'
import { cn } from '@/lib/utils'
import { UserContentHeader } from '@/components/generic/user_content_header'
import { PostComments } from '@/components/post_comments/post_comments'

type PostActions = 'update' | 'delete' | 'report' | 'pin'

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
          `<a class="text-cyan-600" href=${
            route('users.show', {
              params: {
                id: info.id,
              },
            }).path
          }>@${username}</a>`
        )
      })
    }
    return html
  }, [content])
  return (
    <div
      className="post-content whitespace-break-spaces break-words pb-5"
      dangerouslySetInnerHTML={{ __html: parsed }}
    />
  )
}

function LinkPreview({ preview }: { preview: NonNullable<PostResponse['link']> }) {
  return (
    <div className="flex h-auto w-full max-w-[600px] flex-col gap-2 rounded-md border border-slate-200 bg-slate-100 p-3 duration-500 hover:bg-slate-200 lg:h-48 lg:flex-row">
      <div className="relative flex aspect-auto max-w-56 flex-shrink-0 flex-row justify-center rounded-lg">
        <img
          src={preview.metadata.thumbnail}
          className="z-[1] aspect-auto w-60 max-w-full rounded-lg object-cover"
        />
      </div>
      <div className="relative flex w-full flex-col gap-2 overflow-hidden lg:px-5">
        <div>
          <h4 className="truncate text-ellipsis font-bold">{preview.metadata.title}</h4>
          <a
            href={preview.link}
            target="_blank"
            className="flex flex-row items-center truncate text-ellipsis text-sm font-medium text-cyan-600 underline"
          >
            <span className="relative">
              <LinkIcon className="h-3" />
            </span>
            {preview.link}
          </a>
        </div>
        <p className="line-clamp-5 truncate text-wrap text-sm">{preview.metadata.description}</p>
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
        className={`absolute z-[5] m-auto flex h-full w-full flex-col items-center bg-slate-900 duration-700 ${loaded ? 'opacity-0' : 'opacity-85'}`}
      >
        <Loader2 className="m-auto h-10 w-10 animate-spin text-muted" />
      </div>
      <div className="group relative flex aspect-auto min-h-[calc(100vh_-_300px)] w-full flex-row justify-center overflow-hidden rounded-lg">
        <div className="absolute bottom-2 left-2 z-[5] rounded-sm bg-slate-900 px-2 text-white opacity-0 duration-200 group-hover:opacity-100">
          <p className="text-sm font-medium">{image.metadata.filename}</p>
          <p className="text-sm">{mbSize} MB</p>
        </div>
        <img
          onLoad={() => setLoaded(true)}
          src={image.link}
          className={`z-[1] w-auto rounded-lg duration-150 lg:max-h-[700px] ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <img
          src={image.link}
          className={`absolute w-full object-cover opacity-50 blur-md duration-150`}
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
        <div className="relative flex aspect-auto h-[calc(100vh_-_300px)] max-h-[700px] flex-row justify-center overflow-hidden rounded-lg border border-slate-300">
          {attachments.length > 1 && (
            <>
              <Button
                size="icon"
                variant="outline"
                className="absolute left-0 top-[calc(50%_-_20px)] z-[5] cursor-pointer lg:left-5"
                onClick={() => slide('left')}
              >
                <ArrowLeft />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="absolute right-0 top-[calc(50%_-_20px)] z-[5] cursor-pointer lg:right-5"
                onClick={() => slide('right')}
              >
                <ArrowRight />
              </Button>
            </>
          )}

          {attachments.map((attachment, index) => (
            <div
              key={`principal_${attachment.id}_${index}`}
              className={`absolute w-full ${index === imageIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <PostImage key={`principal_${attachment.id}_${index}`} image={attachment} />
            </div>
          ))}
        </div>
        {attachments.length > 1 && (
          <div className="flex h-36 w-full flex-row gap-4 overflow-hidden overflow-x-scroll">
            {attachments.map((attachment, index) => (
              <div
                className={`relative h-36 w-36 overflow-hidden rounded-md border ${index === imageIndex && 'border-gray-200'}`}
                key={`${attachment.id}_${index}`}
              >
                <img
                  className="h-auto max-w-full duration-700 hover:opacity-50"
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

function PostReactionBadge({
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

    const request = await axios(
      route('posts_reactions.store', { params: { id: post?.id! } }).path,
      {
        method: isDelete ? 'delete' : 'post',
        ...(!isDelete && {
          data: {
            reaction: react,
          },
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
    <div className="flex flex-row items-center gap-2">
      {actions ? (
        <HoverCard>
          <HoverCardTrigger>
            <button
              className={`trigger-user-post-react cursor-pointer rounded-full border px-2 ${reaction.type ? 'hover:bg-blue-400-200 border-blue-400 bg-blue-100' : 'border-slate-400 bg-slate-50 hover:bg-slate-200'}`}
              disabled={isSubmitting}
            >
              {reaction.type ? <PostReactionIcon type={reaction.type} /> : '+'}
            </button>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            side="top"
            className="flex w-auto flex-row gap-2 divide-x divide-dashed px-2 py-1"
          >
            {Object.entries(POST_REACTION_ICONS).map(
              ([key, value]: [key: string, value: string]) => (
                <button
                  key={`reaction_${key}`}
                  type="button"
                  className={`react-${key.toLowerCase()} flex flex-row items-center justify-center gap-1 p-1`}
                  onClick={actions ? () => reactToPost(key as PostReactionType) : () => {}}
                >
                  <p className="text-md duration-150 hover:scale-110">{value}</p>
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
          className={`cursor-not-allowed rounded-full border px-2 ${reaction.type ? 'border-blue-400 bg-blue-100' : 'border-slate-400 bg-slate-50'}`}
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
  setPostState,
  abilities,
}: {
  post: PostResponse
  setPostState: Dispatch<SetStateAction<PostResponse>>
  abilities: Partial<Array<PostActions>>
}) {
  const { toast } = useToast()

  async function updatePin() {
    const request = await axios(
      route('posts_pins.update', {
        params: {
          id: post.id,
        },
      }).path,
      {
        method: 'post',
      }
    )

    if (request.status === 200) {
      const { pinned } = await request.data
      setPostState((prevState) => {
        return { ...prevState, pinned }
      })
    } else {
      const { message } = await request.data
      toast({ title: 'Unable to pin post', description: message })
    }
  }

  const actions: Record<PostActions, () => ReactElement> = {
    update: () => (
      <UpdatePost
        post={post}
        trigger={
          <div className="flex w-full flex-row items-center gap-3 hover:cursor-pointer">
            <Button type="button" className="update-post-trigger" variant="ghost" size="sm-icon">
              <Pencil size={15} />
            </Button>
            <p className="text-xs font-normal text-current">Update</p>
          </div>
        }
      />
    ),
    report: () => (
      <ReportPost
        post={post}
        trigger={
          <div className="flex w-full flex-row items-center gap-3 hover:cursor-pointer">
            <Button type="button" className="report-post-trigger" variant="ghost" size="sm-icon">
              <Flag size={15} />
            </Button>
            <p className="text-xs font-normal text-current">Report</p>
          </div>
        }
      />
    ),
    pin: () => (
      <div
        onClick={updatePin}
        className="flex w-full flex-row items-center gap-3 hover:cursor-pointer"
      >
        <Button type="button" variant="ghost" size="sm-icon" className="pin-post-trigger">
          <Pin
            className={cn('text-black', post.pinned ? 'fill-slate-400' : 'fill-white')}
            size={15}
          />
        </Button>
        <p className="text-xs font-normal text-current">Pin</p>
      </div>
    ),
    delete: () => (
      <DeletePost
        post={post}
        trigger={
          <div className="flex w-full flex-row items-center gap-3 hover:cursor-pointer">
            <Button type="button" className="delete-post-trigger" variant="ghost" size="sm-icon">
              <Trash2 size={15} />
            </Button>
            <p className="text-xs font-normal text-current">Delete</p>
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

function PostCommentsBadge({ count, disabled }: { count: number; disabled: boolean }) {
  return (
    <button
      disabled={disabled}
      className={cn(
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        'flex flex-row items-center justify-center gap-1 rounded-full border border-slate-400 bg-slate-50 px-2'
      )}
    >
      <MessageSquareMore size={14} />
      <p id="post-total-comments-count" className="text-xs text-slate-500">
        {count}
      </p>
    </button>
  )
}

export default function PostCard({
  post,
  user,
  actions = true,
  showComments = true,
  redirect = false,
}: {
  post: PostResponse
  user: UserResponse | null
  actions?: boolean
  showComments?: boolean
  redirect?: boolean
}) {
  const [postState, setPostState] = useState<PostResponse>(post)

  return (
    <article className="flex w-full flex-col rounded-sm border bg-white px-6 pt-6">
      <div className="relative flex flex-row justify-between border-b border-b-gray-200 pb-3">
        <Link
          href={
            route('users.show', {
              params: {
                id: post.user.id,
              },
            }).path
          }
        >
          <UserContentHeader user={post.user} createdAt={post.createdAt} />
        </Link>

        {postState.pinned && (
          <div id="pinned-post-icon" className="absolute -left-4 -top-4 -rotate-45">
            <Pin className="fill-slate-300 text-blue-400" size={12} />
            <div className="absolute left-[2px] top-[12px] h-[1px] w-2 bg-blue-400" />
            <div className="absolute left-[4px] top-[14px] h-[1px] w-1 bg-blue-400" />
          </div>
        )}

        {/* // TODO: Review on how to best manage this, BE wise. Explore habilities viewing send from the BE. */}
        {actions && (
          <PostActions
            post={postState}
            setPostState={setPostState}
            abilities={post.user.id !== user?.id ? ['report'] : ['update', 'delete', 'pin']}
          />
        )}
      </div>

      <div className="flex flex-col gap-4 py-4">
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

      <div className="flex flex-row gap-2 border-t border-t-gray-200 px-2 py-4 opacity-70">
        <PostCommentsBadge count={postState.comments.totalCount} disabled={!actions} />
        <PostReactionBadge actions={actions} post={post} currentUser={user} />
      </div>

      {showComments && (
        <PostComments currentUser={user} postState={postState} setPostState={setPostState} />
      )}
    </article>
  )
}
