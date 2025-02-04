import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { MetaResponse } from '#interfaces/pagination'
import { InertiaLinkProps, Link } from '@inertiajs/react'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  )
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'> &
  Omit<InertiaLinkProps, 'size'>

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <Link
    except={['user']}
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

const DefaultPaginator = ({
  meta,
  className,
  baseUrl,
}: {
  meta: MetaResponse
  baseUrl: string
  className?: React.ComponentProps<'nav'>['className']
}) => {
  return (
    <div className="default-paginator mt-2 flex w-full flex-col gap-0 border-t border-t-gray-100 text-center">
      <p className="default-paginator-total mt-2 pt-2 text-sm text-slate-400">
        {meta.total} records
      </p>
      <Pagination className={cn('w-full', className)}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={meta?.previousPageUrl ? baseUrl + meta?.previousPageUrl : '#'}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={baseUrl + meta?.firstPageUrl}>{meta.firstPage}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {meta.lastPage > 1 && (
            <PaginationItem>
              <PaginationLink href={baseUrl + meta?.lastPageUrl || '#'}>
                {meta.lastPage}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem className={cn(!meta?.nextPageUrl && 'cursor-not-allowed opacity-30')}>
            <PaginationNext href={meta?.nextPageUrl ? baseUrl + meta?.nextPageUrl : '#'} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

DefaultPaginator.displayName = 'DefaultPaginator'

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  DefaultPaginator,
}
