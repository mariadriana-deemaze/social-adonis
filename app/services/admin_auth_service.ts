import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Session from '#models/session'

export default class AdminAuthService {
  async show(ctx: HttpContext) {
    const { request, response, session } = ctx
    const { email, password } = request.only(['email', 'password'])
    try {
      const user = await User.verifyCredentials(email, password)
      return await this.authenticate(ctx, user)
    } catch (error) {
      session.flash('errors', {
        email: 'Invalid authentication credentials.',
      })
      return response.redirect().back()
    }
  }

  async destroy({ auth, session, response }: HttpContext) {
    await auth.user!.related('sessions').query().where('sessionToken', session.sessionId).delete()
    await auth.use('admin-web').logout()
    return response.redirect().toPath('/admin/auth/sign-in')
  }

  private async authenticate(
    { auth, session, request, response }: HttpContext,
    user: User
  ): Promise<void> {
    if (!user.isAdmin) throw new Error('Restricted')
    await auth.use('admin-web').login(user)
    await Session.create({
      userId: user.id,
      ipAddress: request.ip(),
      userAgent: request.header('User-Agent'),
      sessionToken: session.sessionId,
    })
    session.put('admin-session-token', session.sessionId)
    return response.redirect().toPath('/admin/index')
  }
}
