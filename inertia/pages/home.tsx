import { Head } from '@inertiajs/react'
import { Button } from '../components/ui/button'

export default function Home(props: { version: number }) {
  return (
    <>
      <Head title="Homepage" />

      <div className="container">
        <div className="title">AdonisJS {props.version} x Inertia x React</div>
        <h1 className="text-1xl font-bold text-red-400 underline">Olá mundo Cruel!</h1>
        <Button variant="outline">Button</Button>
        <span>
          Learn more about AdonisJS and Inertia.js by visiting the{' '}
          <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS documentation</a>.
        </span>
      </div>
    </>
  )
}
