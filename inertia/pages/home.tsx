import { useState } from 'react'
import HeadOG from '@/components/generic/head_og'
import { Link } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'
import { Button } from '@/components/ui/button'
import { Boxes, LucideProps, Rabbit, Shield } from 'lucide-react'
import { faker } from '@faker-js/faker'
import { Card } from '@/components/ui/card'

function FeatureCard({
  Icon,
  title,
  description,
  onClick,
  selected,
}: {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  title: string
  description: string
  onClick: () => void
  selected: boolean
}) {
  console.log('selected', selected)
  return (
    <div
      className="flex flex-row gap-6 rounded-lg border border-gray-300 px-6 py-5"
      onClick={onClick}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border">
        <Icon />
      </div>
      <div>
        <h6 className="text-lg font-semibold">{title}</h6>
        <p>{description}</p>
      </div>
    </div>
  )
}

function TestimonialCard({
  author,
  testimonial,
}: {
  author: { picture: string; name: string; handle: string }
  testimonial: string
}) {
  return (
    <Card className="flex w-full flex-col gap-6 p-4">
      <div className="flex flex-row gap-4">
        <img className="h-12 w-12" src={author.picture} alt="Author picture" />
        <div className="flex flex-col self-center">
          <h5 className="font-bold">{author.name}</h5>
          <h6 className="text-[#525252]">{author.handle}</h6>
        </div>
      </div>
      <p className="text-[#525252]">{testimonial}</p>
    </Card>
  )
}

export default function Home() {
  const STATS = [
    {
      title: 'Active Users',
      value: '10M+',
    },
    {
      title: 'Countries',
      value: '10M+',
    },
    {
      title: 'Posts',
      value: '120',
    },
  ]

  const TESTEMONIALS: {
    author: {
      picture: string
      name: string
      handle: string
    }
    testimonial: string
  }[] = new Array(3).fill(1).map((_, index) => {
    const handle = '@' + faker.internet.displayName()
    return {
      author: {
        name: faker.person.firstName(),
        handle,
        picture: `https://avatar.iran.liara.run/public/${index + 1}`,
      },
      testimonial: faker.lorem.paragraph(),
    }
  })

  const FEATURES: {
    Icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >
    title: string
    description: string
    preview: string
  }[] = [
    {
      Icon: Boxes,
      title: 'Community Driven',
      description: 'Build meaningful connection with like-minded individuals.',
      preview: 'preview_feature_1',
    },
    {
      Icon: Rabbit,
      title: 'Lightning Fast',
      description: 'Experience seamless interactions with our optimized platform.',
      preview: 'preview_feature_2',
    },
    {
      Icon: Shield,
      title: 'Secure by Design',
      description: 'Your privacy and security are our top priorities.',
      preview: 'preview_feature_3',
    },
  ]

  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0)

  const loremParagraphs =
    'Totus debilito depono ipsa aeternus caput deserunt. Catena cariosus arbitro depopulo cinis. Vulgivagus saepe astrum. \nAnimadverto tersus caritas. Conservo copia clarus cariosus vir arbitro conicio volup curatio. Sit currus vilis iste ars reprehenderit sursum unus cum.'

  return (
    <>
      <HeadOG
        title="Homepage"
        description="Homepage of social adonis."
        url={route('home.show').path}
      />

      <section className="mb-64 flex w-full flex-col items-center">
        <div className="flex min-h-[80vh] w-full flex-col justify-center gap-4 rounded-[3rem] bg-gradient-to-b from-[#D3CFC2] from-40% to-[#C4BEB0] p-20 text-center">
          <h1 className="relative flex w-full flex-wrap justify-center gap-x-4 gap-y-0 font-climate text-[45px]">
            <span className="text-blue-200">Connect.</span>
            <span className="text-red-600">Share.</span>
            <span className="text-blue-950">Thrive.</span>
          </h1>
          <div>
            <p>Social networking reimagined.</p>
            <p>
              Join our ten users in creating meaningful connections in our vibrant and small
              community.
            </p>
          </div>

          <div className="grid grid-cols-3 rounded-lg border border-gray-400 bg-white/10 py-4 backdrop-blur-xl">
            {STATS.map((stat) => (
              <div key={stat.value}>
                <h3 className="font-climate text-[3rem] text-black">{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            ))}
          </div>

          <Button className="h-auto w-auto self-center rounded-full px-6 font-climate text-[1.2rem]">
            <Link href={route('auth.show').path}>Join us</Link>
          </Button>
        </div>
        <div className="relative h-16 w-32 bg-[#C4BEB0]">
          <div className="absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-[#F7F8FA]" />
          <div className="absolute -bottom-16 right-16 h-32 w-32 rounded-full bg-[#F7F8FA]" />
        </div>
      </section>

      <section className="mb-64 flex w-full flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center gap-6">
          <h1 className="flex gap-4 text-center font-climate text-[45px] leading-10 text-blue-950">
            Features that set us apart
          </h1>
          <p className="max-w-screen-sm text-center">{loremParagraphs}</p>
        </div>
        <div className="mt-20 flex w-full flex-col gap-4 md:flex-row">
          <ul className="flex min-w-[22rem] flex-col gap-4">
            {FEATURES.map(({ preview, ...feature }, index) => (
              <li key={`feature_${index}_${feature.title.toLowerCase().replace(' ', '_')}`}>
                <FeatureCard
                  selected={index === selectedFeatureIndex}
                  onClick={() => setSelectedFeatureIndex(index)}
                  {...feature}
                />
              </li>
            ))}
          </ul>
          <div className="relative flex w-full flex-grow">
            <div
              className="bg-radial absolute -bottom-24 -right-24 h-48 w-64 rotate-180 scale-150 from-blue-600 from-40% to-transparent opacity-40" // NOTE: Only on tw v4 👀
              style={{
                backgroundImage: 'radial-gradient(#D3CFC2 0%, transparent 60%)',
              }}
            />
            <div
              className="bg-radial absolute -top-24 left-0 h-48 w-64 rotate-180 scale-150 from-blue-600 from-40% to-transparent opacity-20" // NOTE: Only on tw v4 👀
              style={{
                backgroundImage: 'radial-gradient(#D3CFC2 0%, transparent 60%)',
              }}
            />
            <div className="relative h-full w-full rounded-2xl bg-[#F7F8FA] p-4">
              {FEATURES[selectedFeatureIndex].preview}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-64 flex w-full flex-col items-center gap-20">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <h1 className="flex gap-4 font-climate text-[45px] leading-10 text-blue-950">
            What our users say
          </h1>
          <p className="max-w-screen-sm text-center">{loremParagraphs}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {TESTEMONIALS.map((testemonial) => (
            <TestimonialCard key={`testemonial_${testemonial.author}`} {...testemonial} />
          ))}
        </div>
      </section>

      <section className="mb-28 flex w-full flex-col items-center">
        <div className="relative h-16 w-32 bg-[#C4BEB0]">
          <div className="absolute -top-16 left-16 h-32 w-32 rounded-full bg-[#F7F8FA]" />
          <div className="absolute -top-16 right-16 h-32 w-32 rounded-full bg-[#F7F8FA]" />
        </div>
        <div className="flex w-full flex-col gap-4 rounded-[3rem] bg-gradient-to-t from-[#D3CFC2] from-40% to-[#C4BEB0] py-20">
          <div className="flex w-full flex-col items-center gap-6 text-center">
            <h1 className="flex gap-4 font-climate text-[45px] leading-10 text-blue-950">
              Ready to join us?
            </h1>
            <p className="max-w-screen-sm text-center">{loremParagraphs}</p>
          </div>

          <Button className="h-auto w-auto self-center rounded-full px-6 font-climate text-[1.2rem]">
            <Link href={route('auth.show').path}>Join us</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
