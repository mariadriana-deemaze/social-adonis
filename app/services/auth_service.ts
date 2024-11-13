import type { HttpContext } from '@adonisjs/core/http'
import { createAuthValidator } from '#validators/auth'
import User from '#models/user'
import Session from '#models/session'
import { errors } from '@vinejs/vine'
import { errorsReducer } from '#utils/index'

export default class AuthService {
  async create(ctx: HttpContext) {
    const { request, response, session } = ctx

    try {
      const payload = await request.validateUsing(createAuthValidator)

      const user = new User()
      Object.assign(user, payload)
      await user.save()

      return await this.authenticate(ctx, user)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        session.flash('errors', reducedErrors)
      }
      return response.redirect().back()
    }
  }

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
    await auth.use('web').logout()
    return response.redirect().toPath('/')
  }

  private async authenticate(
    { auth, session, request, response }: HttpContext,
    user: User
  ): Promise<void> {
    await auth.use('web').login(user)

    await Session.create({
      userId: user.id,
      ipAddress: request.ip(),
      userAgent: request.header('User-Agent'),
      sessionToken: session.sessionId,
    })

    session.put('session-token', session.sessionId)

    return response.redirect().toPath('/feed')
  }
}
