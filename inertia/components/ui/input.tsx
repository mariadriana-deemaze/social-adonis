import * as React from 'react'
import { cn } from '../../lib/utils'
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  LeftSlot?: (() => React.ReactElement) | boolean
  RightSlot?: (() => React.ReactElement) | boolean
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ LeftSlot, RightSlot, className, type, error, ...props }, ref) => {
    const [controlledType, setControlledType] = React.useState(() => type)

    const controlPasswordInput = (): void => {
      if (type === 'password' && controlledType === 'text') {
        setControlledType('password')
      } else if (type === 'password' && controlledType === 'password') {
        setControlledType('text')
      }
    }

    const handleSlotClick = (): void => {
      if (type === 'password') {
        controlPasswordInput()
      }
    }

    const PasswordSlot = () => (
      <>
        {type === 'password' && controlledType === 'password' && <EyeOff />}
        {type === 'password' && controlledType === 'text' && <Eye />}
      </>
    )

    return (
      <div className={cn('relative flex flex-col', !!error && 'h-14')}>
        {(LeftSlot || type === 'password') && (
          <div className="absolute left-0 top-0 h-10 w-10 cursor-pointer" onClick={handleSlotClick}>
            <div className="flex h-full flex-col items-center justify-center">
              {!!LeftSlot && type === 'password' ? (
                <PasswordSlot />
              ) : (
                LeftSlot && typeof LeftSlot !== 'boolean' && <LeftSlot />
              )}
            </div>
          </div>
        )}
        <input
          type={controlledType}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            !!LeftSlot && 'pl-10',
            !!RightSlot && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {RightSlot && (
          <div
            className="absolute right-0 top-0 h-10 w-10 cursor-pointer"
            onClick={handleSlotClick}
          >
            <div className="flex h-full flex-col items-center justify-center">
              {!!RightSlot && type === 'password' ? (
                <PasswordSlot />
              ) : (
                RightSlot && typeof RightSlot !== 'boolean' && <RightSlot />
              )}
            </div>
          </div>
        )}
        {error && (
          <p className="absolute -bottom-1 w-full truncate text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
