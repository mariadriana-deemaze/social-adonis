import { Authenticators } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/auth/sign-in'

  /**
   * The URL to redirect the admin to, when authentication fails
   */
  adminRedirectTo = '/admin/auth/sign-in'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    _options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    let guard: keyof Authenticators = 'web'
    if (ctx.route?.pattern.includes('admin')) guard = 'admin-web'

    try {
      const user = await ctx.auth.authenticateUsing([guard])
      // NOTE: Should not be required, and only here as a second layer of security.
      if (!user.isAdmin) {
        throw new Error('Restricted area.')
      }

      return next()
    } catch (error) {
      return ctx.response
        .redirect()
        .toPath(guard === 'web' ? this.redirectTo : this.adminRedirectTo)
    }
  }
}
