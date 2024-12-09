import { createAuthValidator } from '#validators/auth'
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

  async reset(user: User) {
    const expiresAt = DateTime.now().plus({ minutes: 10 })
    const genToken = generateNewToken(expiresAt)

    // NOTE: For some reason, on the second update, the date on the expires_at field would be incorrect - would be as the update_at.
    /*  const token = await UserToken.updateOrCreate({
       type: UserTokenType.RESET_ACCESS,
       userId: user.id,
     },
       {
         type: UserTokenType.RESET_ACCESS,
         userId: user.id,
         token: '123', // Generate here
         expiresAt: DateTime.now().plus({ minutes: 10 })
       }) */

    // Doing more explicitly and..
    const record = await UserToken.findBy({
      type: UserTokenType.RESET_ACCESS,
      userId: user.id,
    })

    if (record) {
      Object.assign(record, {
        token: genToken,
        expiresAt,
      })
      record.enableForceUpdate() // ..forcing the update, seem to do the trick. Dunno why yet.
      await record.save()
    } else {
      UserToken.create({
        type: UserTokenType.RESET_ACCESS,
        userId: user.id,
        token: genToken,
        expiresAt,
      })
    }
  }

  async update(
    token: string,
    {
      password,
    }: {
      password: string
      passwordConfirmation: string
    }
  ) {
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
      await trx.query().from('user').where('id', record.userId).update({ password })
      await trx.query().from('user_tokens').where('id', record.id).delete()
      await trx.commit()
    } catch (error) {
      await trx.rollback()
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
