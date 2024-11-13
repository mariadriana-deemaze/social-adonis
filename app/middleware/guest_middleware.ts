import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Guest middleware is used to deny access to routes that can
 * be accessed by unauthenticated users.
 *
 * For example, the login page should not be accessible if the user
 * is already logged-in
 */
export default class GuestMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
  ) {
    let user = null;

    try {
      user = await ctx.auth.authenticate();
    } catch (error) {
    }

    if (!!user && ctx.route?.pattern.includes('auth')) {
      return ctx.response.redirect().back()
    }

    return next()
  }
}
