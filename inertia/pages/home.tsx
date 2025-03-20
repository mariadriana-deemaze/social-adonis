import { Suspense } from 'react'
import HeadOG from '@/components/generic/head_og'
import { route } from '@izzyjs/route/client'
import { faker } from '@faker-js/faker'
import SectionFeatureSlider from '@/components/home/section_feature_slider'
import SectionCTA from '@/components/home/section_cta'
import { InferPageProps } from '@adonisjs/inertia/types'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTestimonials from '@/components/home/section_testimonials'
import type HomeController from '#controllers/home_controller'
import SectionHero from '@/components/home/section_hero'
gsap.registerPlugin(ScrollTrigger)

export default function Home(props: InferPageProps<HomeController, 'index'>) {
  const STATS = [
    {
      title: 'Active Users',
      value: String(props.users_count),
    },
    {
      title: 'Countries',
      value: '150',
    },
    {
      title: 'Posts',
      value: String(props.posts_count),
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

  return (
    <Suspense fallback={<>Loading...</>}>
      <HeadOG
        title="Homepage"
        description="Homepage of social adonis."
        url={route('home.show').path}
      />
      <div className="relative w-full">
        <SectionHero stats={STATS} />

        <SectionFeatureSlider />

        <SectionTestimonials testemonials={TESTEMONIALS} />

        <SectionCTA
          title="Ready to join us?"
          description={faker.lorem.paragraph()}
          cta={{
            text: 'Join Us',
            link: route('auth.show').path,
          }}
        />

        {/*  TODO - Replace with final asset */}
        <img
          className="fixed left-0 top-0 z-[-1] h-80 w-screen overflow-hidden opacity-45"
          src="assets/images/light_rays_edit.png"
          alt=""
        />
      </div>
    </Suspense>
  )
}
