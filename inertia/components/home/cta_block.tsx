import { Link } from '@inertiajs/react'
import TextCutReveal from '@/components/generic/text_cut_reveal'
import TextReveal from '@/components/generic/text_reveal'
import { Button } from '@/components/ui/button'

export default function CTABlock({
  title,
  description,
  cta,
}: {
  title: string
  description?: string
  cta: {
    text: string
    link: string
  }
}) {
  return (
    <>
      <div className="scale-reveal relative h-16 w-32 bg-[#C4BEB0]">
        <div className="absolute -top-16 left-16 h-32 w-32 rounded-full bg-[#F7F8FA]" />
        <div className="absolute -top-16 right-16 h-32 w-32 rounded-full bg-[#F7F8FA]" />
      </div>
      <div className="flex w-full flex-col gap-4 rounded-[3rem] bg-gradient-to-t from-[#D3CFC2] from-40% to-[#C4BEB0] py-20">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <TextCutReveal
            text={title}
            className="brand-blue-text-gradient flex gap-4 text-center font-climate text-[45px] leading-10"
          />
          {description && (
            <TextReveal as="p" text={description} className="max-w-screen-sm text-center" />
          )}
        </div>
        <Button className="h-auto w-auto self-center rounded-full bg-brand-blue-950 px-6 font-climate text-[1.2rem]">
          <Link href={cta.link}>{cta.text}</Link>
        </Button>
      </div>
    </>
  )
}
