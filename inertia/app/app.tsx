/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import Layout from './layout'
import AdminLayout from '@/app/admin-layout'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },
  title: (title: string) => `${title} - ${appName}`,
  resolve: async (name: string) => {
    const page: any = await resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob(['../pages/**/*.tsx', '../images/**'])
    )
    if (name.includes('admin/')) {
      page.default.layout ??= (children: any) => <AdminLayout children={children} />
    } else {
      page.default.layout ??= (children: any) => <Layout children={children} />
    }

    return page
  },
  setup({ el, App, props }) {
    hydrateRoot(el, <App {...props} />)
  },
})
