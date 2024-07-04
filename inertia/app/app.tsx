/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { JSXElementConstructor } from 'react'
import { PageProps } from '@adonisjs/inertia/types'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title: string) => `${title} - ${appName}`,

  resolve: (name: string) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },

  // @ts-ignore
  setup({
    el,
    App,
    props,
  }: {
    el: Element
    App: JSXElementConstructor<PageProps>
    props: PageProps
  }) {
    hydrateRoot(el, <App {...props} />)
  },
})
