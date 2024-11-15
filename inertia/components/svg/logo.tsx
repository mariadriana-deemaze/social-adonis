import { cn } from '@/lib/utils'
import { Link } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'

export default function AdonisLogo({ className }: { className?: string }) {
  const style = cn(`w-16 h-16 fill-primary ${className}`)
  return (
    <Link href={route('home.show').path}>
      <svg className={style} viewBox="0 0 33 33">
        <path
          fillRule="evenodd"
          d="M0 16.333c0 13.173 3.16 16.333 16.333 16.333 13.173 0 16.333-3.16 16.333-16.333C32.666 3.16 29.506 0 16.333 0 3.16 0 0 3.16 0 16.333Zm6.586 3.393L11.71 8.083c.865-1.962 2.528-3.027 4.624-3.027 2.096 0 3.759 1.065 4.624 3.027l5.123 11.643c.233.566.432 1.297.432 1.93 0 2.893-2.029 4.923-4.923 4.923-.986 0-1.769-.252-2.561-.506-.812-.261-1.634-.526-2.695-.526-1.048 0-1.89.267-2.718.529-.801.253-1.59.503-2.538.503-2.894 0-4.923-2.03-4.923-4.924 0-.632.2-1.363.432-1.929Zm9.747-9.613-5.056 11.443c1.497-.699 3.227-1.032 5.056-1.032 1.763 0 3.56.333 4.99 1.032l-4.99-11.444Z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  )
}
