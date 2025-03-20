import { useMemo, useRef, useState } from 'react'
import { Boxes, LucideProps, Rabbit, Shield } from 'lucide-react'
import TextCutReveal from '@/components/generic/text_cut_reveal'
import { cn } from '@/lib/utils'
import TextReveal from '@/components/generic/text_reveal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { faker } from '@faker-js/faker'
gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
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
  selected: { value: boolean; progress: number }
}) {
  return (
    <div
      className={cn(
        'relative flex cursor-pointer flex-row gap-6 overflow-hidden rounded-2xl border border-gray-300 px-6 py-5 transition-all delay-200 ease-in-out',
        selected.value ? 'bg-white shadow-lg' : 'bg-gray-100 shadow-none'
      )}
      onClick={onClick}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-brand-blue-950/5" />
      {selected.value && (
        <div
          className="absolute left-0 top-0 w-1 bg-brand-beige-300/40"
          style={{
            height: selected.progress + '%',
          }}
        />
      )}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border">
        <Icon />
      </div>
      <div className={cn(selected ? 'opacity-100' : 'opacity-70')}>
        <h6 className="text-lg font-semibold">{title}</h6>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function SectionFeatureSlider() {
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  let tl = useRef<GSAPTimeline>(gsap.timeline())

  const sectionProgress = useMemo(() => {
    const totalSections = FEATURES.length
    const sectionRange = 1 / totalSections
    const sectionStart = selectedFeatureIndex * sectionRange
    return Math.min(Math.max((tl.current.progress() - sectionStart) / sectionRange, 0), 1) * 100
  }, [scrollProgress])

  useGSAP(() => {
    const totalScroll = FEATURES.length * window.innerHeight
    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top top-=100',
        end: `+=${totalScroll}`,
        scrub: true,
        pin: true,
      },
      onUpdate: () => setScrollProgress(tl.current.progress()),
    })

    tl.current.to(
      {},
      {
        duration: FEATURES.length,
        onUpdate: function () {
          const progress = tl.current.progress()
          const newIndex = Math.floor(progress * FEATURES.length)
          if (newIndex >= 0 && newIndex <= FEATURES.length - 1) setSelectedFeatureIndex(newIndex)
        },
      }
    )
  }, [])

  return (
    <section className="features-section relative mb-64 flex w-full flex-col items-center gap-10">
      <div className="flex min-h-screen w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-6">
          <TextCutReveal
            text="Features that set us apart"
            className="brand-blue-text-gradient flex gap-4 text-center font-climate text-[45px] leading-10"
          />
          <TextReveal
            as="p"
            text={faker.lorem.paragraph()}
            className="max-w-screen-sm text-center"
          />
        </div>
        <div className="mt-20 flex w-full flex-col gap-8 md:flex-row">
          <div className="mt-10 w-full max-w-[22rem] rounded-3xl bg-gradient-to-b from-gray-500/20 to-transparent p-[2px]">
            <div className="h-full rounded-[22px] bg-gradient-to-b from-gray-200 to-transparent to-80% p-2">
              <ul className="flex max-h-4 w-full flex-row gap-4 md:max-h-[auto] md:flex-col">
                {FEATURES.map(({ preview, ...feature }, index) => (
                  <li
                    className="feature-card"
                    key={`feature_${index}_${feature.title.toLowerCase().replace(' ', '_')}_${tl.current.progress()}`}
                  >
                    <FeatureCard
                      selected={{
                        value: index === selectedFeatureIndex,
                        progress: sectionProgress,
                      }}
                      onClick={() => setSelectedFeatureIndex(index)}
                      {...feature}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative flex min-h-[400px] w-full flex-grow">
            <div
              className="bg-radial absolute -bottom-24 -right-24 h-48 w-64 rotate-180 scale-150 from-blue-600 from-40% to-transparent opacity-40"
              style={{
                backgroundImage: 'radial-gradient(#D3CFC2 0%, transparent 60%)',
              }}
            />
            <div
              className="bg-radial absolute -top-24 left-0 h-48 w-64 rotate-180 scale-150 from-blue-600 from-40% to-transparent opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#D3CFC2 0%, transparent 60%)',
              }}
            />
            <div className="relative h-full w-full rounded-2xl bg-white p-4">
              {FEATURES[selectedFeatureIndex].preview}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
