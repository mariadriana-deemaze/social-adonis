import React from 'react'

export default function AdminPageHeader({
  title,
  children,
  description,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="relative flex w-full flex-col justify-start border-b border-b-gray-200 bg-gray-100 pb-5 text-left lg:h-52">
      <div className="container w-full items-stretch">
        <div className="flex flex-col gap-2">
          <h2 className="touch-pan-right text-2xl font-semibold text-gray-900">{title}</h2>
          <h6 className="line-clamp-2 truncate text-sm font-normal text-gray-700">{description}</h6>
        </div>
        {children && (
          <div className="mt-6 flex min-h-24 w-full flex-col justify-end gap-4 lg:mt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
