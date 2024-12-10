import { createAuthValidator } from '#validators/auth'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import Session from '#models/session'
import { errors } from '@vinejs/vine'
import { errorsReducer } from '#utils/index'
import UserToken, { generateNewToken } from '#models/user_token'
import { UserTokenType } from '#enums/user'
import { DateTime } from 'luxon'
import { isAfter } from 'date-fns'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'

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

  async reset(user: User): Promise<void> {
    const expiresAt = DateTime.now().plus({ minutes: 10 })
    const token = generateNewToken(expiresAt)
    await UserToken.updateOrCreate(
      {
        type: UserTokenType.RESET_ACCESS,
        userId: user.id,
      },
      {
        type: UserTokenType.RESET_ACCESS,
        userId: user.id,
        token,
        expiresAt,
      }
    )
    emitter.emit('auth:reset', { user, token })
  }

  async update(
    token: string,
    {
      password,
    }: {
      password: string
      passwordConfirmation: string
    }
  ): Promise<void> {
    const record = await UserToken.findBy('token', token)

    if (!record) {
      throw Error('Invalid request')
    }

    if (record && isAfter(new Date(), record.expiresAt.toJSDate())) {
      await record.delete()
      throw Error('Token no longer valid')
    }

    const trx = await db.transaction()

    try {
      const encriptedPassword = await hash.make(password)
      await trx
        .query()
        .from('users')
        .where('id', record.userId)
        .update({ password: encriptedPassword })
      await trx.query().from('user_tokens').where('id', record.id).delete()
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw Error(error)
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
