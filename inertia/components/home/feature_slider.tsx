import { useState } from 'react'
import { Boxes, LucideProps, Rabbit, Shield } from 'lucide-react'
import TextCutReveal from '@/components/generic/text_cut_reveal'
import { cn } from '@/lib/utils'
import TextReveal from '@/components/generic/text_reveal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger)

const loremParagraphs =
  'Totus debilito depono ipsa aeternus caput deserunt. Catena cariosus arbitro depopulo cinis. Vulgivagus saepe astrum. \nAnimadverto tersus caritas. Conservo copia clarus cariosus vir arbitro conicio volup curatio. Sit currus vilis iste ars reprehenderit sursum unus cum.'

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
  return (
    <div
      className={cn(
        'flex cursor-pointer flex-row gap-6 rounded-2xl border border-gray-300 px-6 py-5 transition-all delay-200 ease-in-out',
        selected ? 'bg-white' : 'bg-[#F2F2F2]'
      )}
      onClick={onClick}
    >
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

export default function FeatureSlider() {
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0)

  useGSAP(() => {
    const items: gsap.TweenTarget[] = gsap.utils.toArray('.feature-card')

    items.forEach((item, i) => {
      ScrollTrigger.create({
        id: 'feature_card' + String(i + 1),
        // @ts-expect-error
        trigger: item,
        start: `center+=200px center`,
        end: `center center`,
        pinnedContainer: '.features-section',
        pin: '.features-slider',
        pinSpacing: '800px',
        pinType: 'fixed',
        // @ts-ignore
        endTrigger: items[items.length - 1]?.current,
        scrub: true,
        markers: { indent: 180 * i },
        onUpdate: () => setSelectedFeatureIndex(i),
      })
    })
  }, [])

  return (
    <div
      className={`features-slider flex w-full flex-col items-center gap-6 min-h-[${FEATURES.length}00vh]`}
    >
      <div className="flex w-full flex-col items-center gap-6">
        <TextCutReveal
          text="Features that set us apart"
          className="flex gap-4 text-center font-climate text-[45px] leading-10 text-blue-950"
        />
        <TextReveal as="p" text={loremParagraphs} className="max-w-screen-sm text-center" />
      </div>
      <div className="mt-20 flex w-full flex-col gap-8 md:flex-row">
        <ul className="mt-10 flex min-w-[22rem] flex-col gap-4 rounded-2xl border-l border-r border-t bg-gradient-to-b from-black/5 to-transparent p-2">
          {FEATURES.map(({ preview, ...feature }, index) => (
            <li
              className="feature-card"
              key={`feature_${index}_${feature.title.toLowerCase().replace(' ', '_')}`}
            >
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
          <div className="relative h-full w-full rounded-2xl bg-white p-4">
            {FEATURES[selectedFeatureIndex].preview}
          </div>
        </div>
      </div>
    </div>
  )
}
