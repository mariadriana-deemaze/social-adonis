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

  async handle(ctx: HttpContext, next: NextFn) {
    try {
      await ctx.auth.authenticate()
      return next()
    } catch (error) {
      return ctx.response.redirect().toPath(this.redirectTo)
    }
  }
}
