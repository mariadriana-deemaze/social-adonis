import { ElementType, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger)

type TextElementType = Extract<ElementType, 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>

export default function TextReveal({
  as: Component = 'h1',
  text,
  className,
}: {
  as: TextElementType
  text: string
  className?: HTMLElement['className']
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
      lineHeight: '40px',
      filter: 'blur(5px)',
      scrollTrigger: {
        trigger,
        start: 'bottom bottom',
        end: 'top 60%',
        scrub: 0.5,
      },
    })
  }, [])

  return (
    <Component ref={textElement} className={cn('text-reveal', className)}>
      {text}
    </Component>
  )
}
