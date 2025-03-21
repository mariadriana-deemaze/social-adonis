import AdonisLogo from '@/components/svg/logo'
import { cn } from '@/lib/utils'
import { Facebook, InstagramIcon, Linkedin, SparklesIcon } from 'lucide-react'

type LinkAvailability = 'ON' | 'OFF' | 'COMING_SOON'

type NavigationLink = {
  status: LinkAvailability
  title: string
  href: string
}

function NavigationList({
  links,
  className,
}: {
  links: NavigationLink[]
  className?: HTMLUListElement['className']
}) {
  return (
    <ul className={className}>
      {links.map((link) => {
        const linkStyle = cn(
          'relative w-full flex gap-2 justify-center',
          link.status === 'COMING_SOON' ? 'text-gray-400' : 'text-gray-600'
        )

        return (
          <li className="relative w-full text-center" key={`links_product_${link.title}`}>
            <a className={linkStyle} href={link.href}>
              {link.title}
              {link.status === 'COMING_SOON' && (
                <span className="flex w-max flex-row items-center gap-2 rounded-full bg-orange-500/10 px-2 py-[1px] text-[10px] font-bold text-orange-500">
                  <SparklesIcon className="w-3" />
                  SOON
                </span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  const LINKS: Record<'product' | 'company', NavigationLink[]> = {
    product: [
      {
        status: 'ON',
        title: 'Features',
        href: '#',
      },
      {
        status: 'COMING_SOON',
        title: 'Community',
        href: '#',
      },
    ],
    company: [
      {
        status: 'ON',
        title: 'About',
        href: '#',
      },
      {
        status: 'ON',
        title: 'Contact',
        href: '#',
      },
    ],
  }

  const SOCIALS = [
    { Icon: () => <Facebook className="w-4" />, href: '#' },
    { Icon: () => <InstagramIcon className="w-4" />, href: '#' },
    { Icon: () => <Linkedin className="w-4" />, href: '#' },
  ]

  return (
    <footer className="sticky bottom-0 flex w-full flex-col items-center gap-4 border-t bg-white pb-5 pt-14 md:min-h-[none]">
      <div className="grid w-full max-w-screen-lg grid-cols-1 place-items-center gap-8 pb-20 text-center md:grid-cols-4 md:place-items-start md:text-left">
        <div className="flex w-full flex-col items-center">
          <AdonisLogo className="w-44" />
        </div>
        <div className="flex w-full flex-col items-center">
          <h6 className="font-bold text-blue-950">Product</h6>
          <NavigationList className="mt-2 flex flex-col gap-2" links={LINKS.product} />
        </div>
        <div className="flex w-full flex-col items-center">
          <h6 className="font-bold text-blue-950">Company</h6>
          <NavigationList className="mt-2 flex flex-col gap-2" links={LINKS.company} />
        </div>
        <div className="flex w-full flex-col items-center">
          <h6 className="font-bold text-blue-950">Follow Us</h6>
          <ul className="mt-2 flex w-full flex-row justify-center gap-4">
            {SOCIALS.map(({ Icon, href }, index) => (
              <li key={`links_socials_${index}`}>
                <a href={href}>
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="w-full border-t pt-4 text-center text-sm">
        © {year} Social Adonis. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
