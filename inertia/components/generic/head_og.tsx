import { Head, usePage } from '@inertiajs/react'
import socialAdonisLogo from '../../../public/assets/images/thumbnail.png'

interface HeadOGProps {
  title: string
  description: string
  url: string
  image?: string
}

export default function HeadOG({ title, description, image, url }: HeadOGProps) {
  const props = usePage().props

  const domain = props.domain

  return (
    <Head title={title}>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || domain + socialAdonisLogo} />
      <meta property="og:url" content={domain + url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Social Adonis" />
      <meta property="og:locale" content="en_US" />
    </Head>
  )
}
