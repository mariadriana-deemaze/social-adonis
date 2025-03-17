import AdonisLogo from '@/components/svg/logo'
import { Facebook, InstagramIcon, Linkedin } from 'lucide-react'

function Footer() {
  const LINKS = {
    product: [
      { title: 'Features', href: '#' },
      { title: 'Community', href: '#' },
    ],
    company: [
      { title: 'About', href: '#' },
      { title: 'Contact', href: '#' },
    ],
  }

  const SOCIALS = [
    { Icon: Facebook, href: '#' },
    { Icon: InstagramIcon, href: '#' },
    { Icon: Linkedin, href: '#' },
  ]

  return (
    <footer className="flex w-full flex-col items-center gap-4 border-t bg-white pb-5 pt-14">
      <div className="grid w-full max-w-screen-lg grid-cols-1 place-items-center gap-8 pb-20 text-center md:grid-cols-4 md:place-items-start md:text-left">
        <div>
          <AdonisLogo className="w-36" />
        </div>
        <div>
          <h6 className="font-bold">Product</h6>
          <ul className="mt-2">
            {LINKS.product.map((link) => (
              <li key={`links_product_${link.title}`}>
                <a href={link.href}>{link.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h6 className="font-bold">Company</h6>
          <ul className="mt-2">
            {LINKS.company.map((link) => (
              <li key={`links_company_${link.title}`}>
                <a href={link.href}>{link.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h6 className="font-bold">Follow Us</h6>
          <ul className="mt-2 flex flex-row gap-4">
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
      <hr />
      <p className="text-center">© 2025 Social Adonis. All rights reserved.</p>
    </footer>
  )
}

export default Footer
