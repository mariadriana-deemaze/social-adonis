import Divider from '@/components/generic/divider'
import { Button } from '@/components/ui/button'
import { route } from '@izzyjs/route/client'
import { Chrome, Github } from 'lucide-react'

interface SocialButtonsProps {
  disabled?: boolean
}

const SOCIALS = [
  {
    provider: 'Google',
    Icon: Chrome,
  },
  {
    provider: 'GitHub',
    Icon: Github,
  },
]

function SocialButtons({ disabled = false }: SocialButtonsProps) {
  return (
    <>
      <Divider text="with socials" color="gray-500" />

      {SOCIALS.map(({ provider, Icon }) => {
        const providerLC = provider.toLowerCase()
        return (
          <Button
            key={`auth-${providerLC}`}
            type="button"
            className="w-full"
            variant="outline"
            disabled={disabled}
          >
            <a
              className="flex flex-row items-center gap-2"
              href={
                route('auth.redirect', {
                  params: {
                    provider: providerLC,
                  },
                }).path
              }
            >
              <Icon size={16} />
              {provider}
            </a>
          </Button>
        )
      })}
    </>
  )
}

export default SocialButtons
