import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import TextReveal from '@/components/generic/text_reveal'
import { Button } from '@/components/ui/button'
import { route } from '@izzyjs/route/client'
import { Link } from '@inertiajs/react'
gsap.registerPlugin(ScrollTrigger)

export default function SectionHero({ stats }: { stats: { title: string; value: string }[] }) {
  const container = useRef<HTMLDivElement | null>(null)
  const tl = useRef<GSAPTimeline>()

  useGSAP(
    () => {
      const statements: gsap.TweenTarget[] = gsap.utils.toArray('.social-adonis-statement')
      const blurredIn: gsap.TweenTarget[] = gsap.utils.toArray('.blurred-in')

      tl.current = gsap
        .timeline({
          onStart: () => {
            gsap.set(document.body, { overflowY: 'hidden', overflowX: 'hidden' })
            gsap.set('.hero', { zIndex: 999 })
          },
          onComplete: () => {
            gsap.set(document.body, { overflowY: 'auto', overflowX: 'hidden' })
            gsap.set('.hero', { zIndex: 1 })
          },
        })
        .delay(0.5)
        .from('.hero', {
          scale: 3,
          y: -80,
          duration: 0.5,
          delay: 0.5,
          ease: 'bounce.inOut',
        })
        .to(statements, { y: 0, stagger: 0.75, duration: 0.2, ease: 'bounce.in' })
        .from(blurredIn, {
          opacity: 0,
          filter: 'blur(12px)',
          delay: 1,
          duration: 1,
          ease: 'circ.inOut',
        })
        .from('.cta-button', { opacity: 0, delay: 0.2, scale: 0.5 })
        .from(document.getElementsByTagName('nav'), {
          y: -100,
          duration: 0.75,
          ease: 'bounce.inOut',
        })
    },
    { scope: container }
  )

  useEffect(() => {
    if (!tl?.current) return
    tl.current.play()
  }, [tl])

  return (
    <section
      ref={container}
      className="relative mb-64 flex min-h-[800px] w-full flex-col items-center"
    >
      <div className="hero absolute z-50 mb-64 flex w-full flex-col items-center">
        <div className="brand-beige-gradient relative flex min-h-[80vh] w-full flex-col justify-center gap-4 overflow-hidden rounded-[3rem] px-4 py-12 text-center md:p-20">
          <h1 className="relative z-10 flex w-full flex-row flex-wrap justify-center gap-x-4 gap-y-0 font-climate text-[45px]">
            <span className="relative h-16 min-w-80 overflow-hidden">
              <span className="social-adonis-statement absolute left-0 translate-y-12 bg-gradient-to-b from-[#C4BEB0] from-0% to-[#1474B6] bg-clip-text text-transparent">
                Connect.
              </span>
            </span>
            <span className="relative h-16 min-w-56 overflow-hidden">
              <span className="social-adonis-statement absolute left-0 translate-y-12 bg-gradient-to-b from-[#C16969] from-0% to-[#8C8983] bg-clip-text text-transparent">
                Share.
              </span>
            </span>
            <span className="relative h-16 min-w-56 overflow-hidden">
              <span className="social-adonis-statement brand-blue-text-gradient absolute left-0 translate-y-12">
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

          <div className="blurred-in bg-black/05 z-10 mt-10 grid grid-cols-1 rounded-lg border border-brand-beige-700/20 py-4 backdrop-blur-lg md:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={stat.value + index}>
                <h3 className="font-climate text-[3rem] text-black">{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            ))}
          </div>

          <Button className="cta-button z-10 h-auto w-auto self-center rounded-full bg-brand-blue-950 px-6 font-climate text-[1.2rem]">
            <Link href={route('auth.show').path}>Join us</Link>
          </Button>

          {/* TODO: REPLACE ME FOR VIDEO */}
          <img
            src="assets/images/dummy_hero_edit.png"
            className="absolute bottom-0 left-0 w-3/4 mix-blend-lighten delay-300 duration-1000 ease-in-out animate-in fade-in"
            alt="REPLACE ME"
          />

          <img
            className="absolute left-0 top-0 z-[0] h-full w-full overflow-hidden rounded-[3rem] opacity-80 mix-blend-luminosity"
            src="assets/images/light_rays_edit.png"
            alt="decorative"
          />
        </div>
        <div className="relative mb-[1px] h-16 w-32">
          <img src="assets/images/pointer.svg" alt="decorative" />
        </div>
      </div>
    </section>
  )
}
