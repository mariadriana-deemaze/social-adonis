import { UserResponse } from '#interfaces/user'
import { UserService } from '#services/user_service'
import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    user: async (ctx): Promise<UserResponse | null> => {
      if (ctx?.auth?.user) {
        const service = new UserService() // TODO: Figure out if there's a better way to go around this, and if that brings any performance penalty.
        const user = await service.serialize(ctx?.auth?.user)
        return user
      } else {
        return null
      }
    },
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    pages: (_ctx, page) => !page.startsWith('admin')
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> { }
}
