import { cn } from '@/lib/utils'
import { TWColor } from '@/types/utils'

interface DividerProps {
  text: string
  color?: TWColor
}

function Divider({ text, color = 'gray-500' }: DividerProps) {
  return (
    <div className={cn('flex flex-row items-center gap-4', `color-${color}`)}>
      <hr className="flex flex-grow" />
      <small className={cn('uppercase', `text-${color}`)}>{text}</small>
      <hr className="flex flex-grow" />
    </div>
  )
}

export default Divider
