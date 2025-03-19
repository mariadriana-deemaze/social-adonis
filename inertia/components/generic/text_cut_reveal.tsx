import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger)

export default function TextCutReveal({
  text,
  className,
}: {
  text: string
  className: HTMLElement['className']
}) {
  const textElement = useRef<HTMLHeadingElement | null>(null)

  useGSAP(() => {
    const trigger = textElement?.current
    if (trigger === null) return
    gsap.from(trigger, {
      y: 100,
      opacity: 0,
      duration: 2,
      ease: 'expo.inOut',
      scrollTrigger: {
        trigger,
        start: 'bottom bottom',
        end: 'top 20%',
        scrub: 0.5,
      },
    })
  }, [])

  return (
    <div
      className="min-h-10 overflow-hidden"
      style={{
        minHeight: textElement.current?.clientHeight + 'px',
      }}
    >
      <h1 ref={textElement} className={cn('text-reveal', className)}>
        {text}
      </h1>
    </div>
  )
}
