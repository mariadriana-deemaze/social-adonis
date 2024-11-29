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
        'mt-2 flex flex-col gap-1 rounded-md border px-4 py-2',
        type === 'success' && 'border-green-200 bg-green-100',
        type === 'info' && 'border-blue-200 bg-blue-100',
        type === 'error' && 'border-red-200 bg-red-100',
        className
      )}
    >
      <h6
        className={cn(
          'text-sm font-medium',
          type === 'success' && 'text-green-500',
          type === 'info' && 'text-blue-500',
          type === 'error' && 'text-red-500'
        )}
      >
        {title}
      </h6>
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
