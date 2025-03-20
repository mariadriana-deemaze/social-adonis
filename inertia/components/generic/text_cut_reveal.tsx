import { /* useEffect, useLayoutEffect,  */ useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import SplitType from 'split-type'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
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
      duration: 2,
      ease: 'expo.inOut',
      scrollTrigger: {
        trigger,
        start: 'bottom bottom',
        end: 'bottom bottom+=150',
        scrub: 3,
      },
    })
  }, {})

  // TODO: Improve by split type
  /* useEffect(() => {
    if (textElement?.current) {
      const element = SplitType.create(textElement.current, {
        types: 'lines',
        tagName: 'span',
      })
      console.log('element ->', element)

      const trigger = textElement?.current
      if (trigger === null) return
      gsap.from(trigger, {
        y: 100,
        duration: 2,
        ease: 'expo.inOut',
        scrollTrigger: {
          trigger,
          start: 'bottom bottom',
          end: 'bottom bottom+=150',
          scrub: 3,
        },
      })
    }
  }, [textElement?.current]) */

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
