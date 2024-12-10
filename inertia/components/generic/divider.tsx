import { cn } from '@/lib/utils'

interface DividerProps {
  text: string
  color?: string // TW-color - check if there's a way to autosuggest
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
