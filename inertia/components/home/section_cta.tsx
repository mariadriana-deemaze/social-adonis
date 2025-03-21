import { Link } from '@inertiajs/react'
import TextCutReveal from '@/components/generic/text_cut_reveal'
import TextReveal from '@/components/generic/text_reveal'
import { Button } from '@/components/ui/button'

export default function SectionCTA({
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
    <section className="relative mb-28 flex w-full flex-col items-center">
      <div className="scale-reveal relative h-16 w-32">
        <img className="mt-[1px] rotate-180" src="assets/images/pointer.svg" alt="decorative" />
      </div>
      <div className="brand-beige-gradient relative flex w-full flex-col gap-4 rounded-[3rem] bg-gradient-to-b px-4 py-10">
        <img
          className="absolute left-0 top-0 z-[0] h-full w-full overflow-hidden rounded-[3rem] opacity-70 mix-blend-luminosity"
          src="assets/images/light_rays_edit.png"
          alt="decorative"
        />
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <TextCutReveal
            text={title}
            className="brand-blue-text-gradient flex gap-4 text-center font-climate text-[45px] leading-10"
          />
          {description && (
            <TextReveal as="p" text={description} className="max-w-screen-sm text-center" />
          )}
        </div>
        <Button className="z-10 h-auto w-auto self-center rounded-full bg-brand-blue-950 px-6 font-climate text-[1.2rem]">
          <Link href={cta.link}>{cta.text}</Link>
        </Button>
      </div>
    </section>
  )
}
