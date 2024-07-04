import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name: string) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      return pages[`../pages/${name}.tsx`]
    },
    // @ts-ignore
    setup: ({ App, props }) => <App {...props} />,
  })
}
