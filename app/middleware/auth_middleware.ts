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
   * The URL to redirect to, when authentication fails
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
      await ctx.auth.authenticateUsing([guard])
      return next()
    } catch (error) {
      return ctx.response
        .redirect()
        .toPath(guard === 'web' ? this.redirectTo : this.adminRedirectTo)
    }
  }
}
