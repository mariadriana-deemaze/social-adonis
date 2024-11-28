import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUpFromDot } from 'lucide-react'

export default function ScrollTop() {
  const topRef = useRef<HTMLButtonElement>(null)

  function scrollTop() {
    if (!window) return
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', (event) => {
      // @ts-ignore
      const scroll = event.srcElement.scrollingElement.scrollTop
      const classList = topRef.current?.classList

      const inClasses = ['fade-in', 'animate-in', 'spin-in-90']
      const outClasses = ['fade-out', 'animate-out', 'spin-out-90']

      if (scroll > 1000) {
        outClasses.map((className) => classList?.remove(className))
        inClasses.map((className) => classList?.add(className))
      } else {
        inClasses.map((className) => classList?.remove(className))
        outClasses.map((className) => classList?.add(className))
      }
    })
  }, [])

  return window ? (
    <Button
      ref={topRef}
      onClick={scrollTop}
      size="icon"
      className="fixed right-4 bottom-4 z-10 duration-1000"
      type="button"
    >
      <ArrowUpFromDot size={15} />
    </Button>
  ) : (
    <></>
  )
}
