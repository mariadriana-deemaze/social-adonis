import type { HttpContext } from '@adonisjs/core/http'
import { createAuthValidator } from '#validators/auth'
import User from '#models/user'
import Session from '#models/session'

export default class AuthService {
  async create(ctx: HttpContext) {
    const { request, inertia } = ctx
    const payload = await request.validateUsing(createAuthValidator)

    const existant = await User.query().where('email', payload.email).first()
    if (existant) {
      return inertia.render('sign-up', {
        errors: { email: ['An user with the provided email already exists.'] },
      })
    }

    const user = new User()
    Object.assign(user, payload)
    await user.save()

    return await this.authenticate(ctx, user)
  }

  async show(ctx: HttpContext) {
    const { request, response, inertia } = ctx
    const { email, password } = request.only(['email', 'password'])
    try {
      const user = await User.verifyCredentials(email, password)
      return await this.authenticate(ctx, user)
    } catch (error) {
      if (error.code === 'E_INVALID_CREDENTIALS') {
        return inertia.render('sign-in', { errors: { email: ['Invalid credentials'] } })
      }
      return response.redirect().toRoute('feed.index', { hello: 'hello' })
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
