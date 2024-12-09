import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import { updateAuthValidator } from '#validators/auth'
import { errors } from '@vinejs/vine'
import { errorsReducer } from '#utils/index'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}
  async store(ctx: HttpContext) {
    return await this.authService.create(ctx)
  }

  async show(ctx: HttpContext) {
    return await this.authService.show(ctx)
  }

  async update({ request, session, response }: HttpContext): Promise<void> {
    const token: string | null = request.qs().token
    const payload = request.body()

    try {
      if (!token) throw Error('Invalid request')
      const data = await updateAuthValidator.validate(payload)
      await this.authService.update(token, data)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        return response.badRequest(reducedErrors)
      }
      session.flash('errors', {
        password: error.message,
      })
      return response.redirect().back()
    }
  }

  async reset({ request, response, session }: HttpContext): Promise<void> {
    const { email } = request.only(['email'])

    const user = await User.findBy('email', email)
    if (!user) {
      session.flash('errors', {
        email: 'User not found',
      })
      return response.redirect().back()
    }

    try {
      await this.authService.reset(user)
      session.flash('notification', {
        type: 'success',
        message: 'Request submitted with success. Check your inbox.',
      })
      return response.redirect().toRoute('auth.show')
    } catch (error) {
      console.error('error ->', error)
      // TODO: Refactor as generic notification, diferentiated by type.
      session.flash('errors', {
        message: 'Invalid request',
      })
      return response.redirect().toRoute('auth.show')
    }
  }

  async destroy(ctx: HttpContext) {
    return await this.authService.destroy(ctx)
  }
}
