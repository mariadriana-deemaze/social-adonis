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
    <div className="flex flex-col justify-start relative lg:h-52 pb-5 text-left w-full border-b border-b-gray-200 bg-gray-100">
      <div className="w-full container items-stretch">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-gray-900 touch-pan-right">{title}</h2>
          <h6 className="text-sm font-normal text-gray-700 truncate line-clamp-2">{description}</h6>
        </div>
        {children && (
          <div className="flex flex-col gap-4 min-h-24 w-full justify-end mt-6 lg:mt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
