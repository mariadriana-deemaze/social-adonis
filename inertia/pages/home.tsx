import { Suspense, useEffect, useRef } from 'react'
import HeadOG from '@/components/generic/head_og'
import { Link } from '@inertiajs/react'
import { route } from '@izzyjs/route/client'
import { Button } from '@/components/ui/button'
import { faker } from '@faker-js/faker'
import { Card } from '@/components/ui/card'
import FeatureSlider from '@/components/home/feature_slider'
import CTABlock from '@/components/home/cta_block'
import TextCutReveal from '@/components/generic/text_cut_reveal'
import TextReveal from '@/components/generic/text_reveal'
import { InferPageProps } from '@adonisjs/inertia/types'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger)
import type HomeController from '#controllers/home_controller'

function TestimonialCard({
  author,
  testimonial,
}: {
  author: { picture: string; name: string; handle: string }
  testimonial: string
}) {
  return (
    <Card className="fade-in-up flex w-full flex-col gap-6 p-4">
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

  const loremParagraphs =
    'Totus debilito depono ipsa aeternus caput deserunt. Catena cariosus arbitro depopulo cinis. Vulgivagus saepe astrum. \nAnimadverto tersus caritas. Conservo copia clarus cariosus vir arbitro conicio volup curatio. Sit currus vilis iste ars reprehenderit sursum unus cum.'

  const container = useRef<HTMLElement | null>(null)
  const tl = useRef<GSAPTimeline>()

  useGSAP(
    () => {
      const statements: gsap.TweenTarget[] = gsap.utils.toArray('.social-adonis-statement')
      const blurredIn: gsap.TweenTarget[] = gsap.utils.toArray('.blurred-in')
      const fadeInUp: gsap.TweenTarget[] = gsap.utils.toArray('.fade-in-up')

      tl.current = gsap
        .timeline({
          onStart: () => {
            gsap.set(document.body, { overflow: 'hidden' })
            gsap.set('.hero', { zIndex: 999 })
          },
          onComplete: () => {
            gsap.set(document.body, { overflow: 'auto' })
            gsap.set('.hero', { zIndex: 1 })
          },
        })
        .delay(1)
        .from('.hero', { scale: 2, duration: 1, delay: 1, ease: 'bounce.inOut' })
        .to(statements[0], { y: 0, duration: 0.2, ease: 'bounce.in' })
        .to(statements[1], { y: 0, delay: 0.5, duration: 0.2, ease: 'bounce.in' })
        .to(statements[2], { y: 0, delay: 0.7, duration: 0.2, ease: 'bounce.in' })
        .from(blurredIn, { opacity: 0, filter: 'blur(20px)', delay: 1, duration: 2 })
        .from('.cta-button', { opacity: 0, delay: 1, scale: 0.5 })

      fadeInUp.map((item) => {
        gsap.from(item, {
          y: -100,
          opacity: 0,
          scrollTrigger: {
            // @ts-expect-error
            trigger: item,
            start: 'bottom bottom',
            end: 'top 20%',
            scrub: true,
            // markers: true,
          },
        })
      })
    },
    { scope: container }
  )

  useEffect(() => {
    if (!tl?.current) return
    tl.current.play()
  }, [tl])

  return (
    <Suspense fallback={<>Loading...</>}>
      <section ref={container}>
        <HeadOG
          title="Homepage"
          description="Homepage of social adonis."
          url={route('home.show').path}
        />
        <section className="relative mb-64 flex min-h-[800px] w-full flex-col items-center">
          <div className="hero absolute z-50 mb-64 flex w-full flex-col items-center">
            <div className="relative flex min-h-[80vh] w-full flex-col justify-center gap-4 overflow-hidden rounded-[3rem] bg-gradient-to-b from-[#D3CFC2] from-40% to-[#C4BEB0] p-20 text-center">
              <h1 className="relative z-10 flex w-full flex-row flex-wrap justify-center gap-x-4 gap-y-0 font-climate text-[45px]">
                <span className="relative h-16 min-w-80 overflow-hidden">
                  <span className="social-adonis-statement absolute left-0 translate-y-12 text-blue-200">
                    Connect.
                  </span>
                </span>
                <span className="relative h-16 min-w-56 overflow-hidden">
                  <span className="social-adonis-statement absolute left-0 translate-y-12 text-red-600">
                    Share.
                  </span>
                </span>
                <span className="relative h-16 min-w-56 overflow-hidden">
                  <span className="social-adonis-statement absolute left-0 translate-y-12 text-blue-950">
                    Thrive.
                  </span>
                </span>
              </h1>

              <div className="blurred-in z-10">
                <TextReveal as="p" text="Social networking reimagined." />
                <TextReveal
                  as="p"
                  text="Join our ten users in creating meaningful connections in our vibrant and small
                community."
                />
              </div>

              <div className="blurred-in border-lightgray-400/50 bg-white/05 z-10 mt-10 grid grid-cols-3 rounded-lg border py-4 backdrop-blur-lg">
                {STATS.map((stat, index) => (
                  <div key={stat.value + index}>
                    <h3 className="font-climate text-[3rem] text-black">{stat.value}</h3>
                    <p>{stat.title}</p>
                  </div>
                ))}
              </div>

              <Button className="cta-button z-10 h-auto w-auto self-center rounded-full px-6 font-climate text-[1.2rem]">
                <Link href={route('auth.show').path}>Join us</Link>
              </Button>

              {/* TODO: REPLACE ME FOR VIDEO */}
              <img
                src="../../../public/assets/images/dummy_hero.png"
                className="absolute bottom-0 left-0 w-3/4 mix-blend-lighten delay-700 duration-700 animate-in fade-in-35"
                alt="REPLACE ME"
              />
            </div>
            <div className="relative h-16 w-32 bg-[#C4BEB0]">
              <div className="absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-[#F7F8FA]" />
              <div className="absolute -bottom-16 right-16 h-32 w-32 rounded-full bg-[#F7F8FA]" />
            </div>
          </div>
        </section>

        <section className="features-section relative mb-64 flex w-full flex-col items-center gap-10">
          <FeatureSlider />
        </section>

        <section className="relative mb-64 flex w-full flex-col items-center gap-20">
          <div className="flex w-full flex-col items-center gap-6 text-center">
            <TextCutReveal
              text="What our users say"
              className="flex gap-4 text-center font-climate text-[45px] leading-10 text-blue-950"
            />
            <TextReveal as="p" text={loremParagraphs} className="max-w-screen-sm text-center" />
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            {TESTEMONIALS.map((testemonial) => (
              <TestimonialCard key={`testemonial_${testemonial.author.name}`} {...testemonial} />
            ))}
          </div>
        </section>

        <section className="relative mb-28 flex w-full flex-col items-center">
          <CTABlock
            title="Ready to join us?"
            description={loremParagraphs}
            cta={{
              text: 'Join Us',
              link: route('auth.show').path,
            }}
          />
        </section>
      </section>
    </Suspense>
  )
}
