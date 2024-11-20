import { cn } from '@/lib/utils'

export default function InfoPanel({
  type,
  title,
  description,
  className,
}: {
  type: 'info' | 'success' | 'error'
  title: string
  description?: string
  className?: HTMLDivElement['className']
}) {
  return (
    <div
      className={cn(
        'border  rounded-md mt-2 py-2 px-4',
        type === 'success' && 'border-green-200 bg-green-100',
        type === 'info' && 'border-blue-200 bg-blue-100',
        type === 'error' && 'border-red-200 bg-red-100',
        className
      )}
    >
      <p
        className={cn(
          'text-sm',
          type === 'success' && 'text-green-500',
          type === 'info' && 'text-blue-500',
          type === 'error' && 'text-red-500'
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          'text-xs',
          type === 'success' && 'text-green-500',
          type === 'info' && 'text-blue-500',
          type === 'error' && 'text-red-500'
        )}
      >
        {description}
      </p>
    </div>
  )
}
