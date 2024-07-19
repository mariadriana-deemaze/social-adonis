import { Head, useForm, usePage } from '@inertiajs/react'
import { Toaster } from '../components/ui/toaster'
import { useEffect } from 'react'

export default function Feed(props: unknown) {
  useEffect(() => {
    console.log('props ->', props)
  }, [props])

  return (
    <>
      <Head title="Feed" />
      <div className="container gap-4">Feed me!</div>
      <Toaster />
    </>
  )
}
