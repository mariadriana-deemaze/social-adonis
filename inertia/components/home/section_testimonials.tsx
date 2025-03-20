import { useLayoutEffect, useRef, useState } from 'react'
import TextCutReveal from '@/components/generic/text_cut_reveal'
import TextReveal from '@/components/generic/text_reveal'
import { Card } from '@/components/ui/card'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { faker } from '@faker-js/faker'
gsap.registerPlugin(ScrollTrigger)

function TestimonialCard({
  author,
  testimonial,
}: {
  author: { picture: string; name: string; handle: string }
  testimonial: string
}) {
  return (
    <Card className="card-fade-in-up flex w-full flex-col gap-6 p-4">
      <div className="flex flex-row gap-4">
        <img className="h-12 w-12" src={author.picture} alt="Author picture" />
        <div className="flex flex-col self-center">
          <h5 className="font-bold">{author.name}</h5>
          <h6 className="text-gray-500">{author.handle}</h6>
        </div>
      </div>
      <p className="text-gray-500">{testimonial}</p>
    </Card>
  )
}

export default function SectionTestimonials({
  testemonials,
}: {
  testemonials: {
    author: {
      picture: string
      name: string
      handle: string
    }
    testimonial: string
  }[]
}) {
  const [cards, setCards] = useState<gsap.TweenTarget[]>([])
  const container = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      if (cards.length === 0) return
      cards.map((card) => {
        const trigger = card as gsap.DOMTarget
        gsap.from(trigger, {
          y: 50,
          opacity: 0.4,
          scale: 0.95,
          stagger: 0.2,
          scrollTrigger: {
            trigger,
            start: 'bottom bottom',
            end: 'top 20%',
            scrub: true,
          },
        })
      })
    },
    { scope: container, dependencies: [cards] }
  )

  useLayoutEffect(() => {
    const items: gsap.TweenTarget[] = gsap.utils.toArray('.card-fade-in-up')
    if (items) setCards(items)
  }, [cards.length === 0])

  return (
    <section ref={container} className="relative mb-64 flex w-full flex-col items-center gap-20">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <TextCutReveal
          text="What our users say"
          className="brand-blue-text-gradient flex gap-4 text-center font-climate text-[45px] leading-10"
        />
        <TextReveal as="p" text={faker.lorem.paragraph()} className="max-w-screen-sm text-center" />
      </div>
      <div className="section-fade-in-up grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {testemonials.map((testemonial) => (
          <TestimonialCard key={`testemonial_${testemonial.author.name}`} {...testemonial} />
        ))}
      </div>
    </section>
  )
}
