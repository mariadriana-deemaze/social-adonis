import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { updateUserValidator } from '#validators/user'
import { errors } from '@vinejs/vine'
import { errorsReducer } from '#utils/index'
import { UserService } from '#services/user_service'
import { UserResponse } from '#interfaces/user'
import { PageObject } from '@adonisjs/inertia/types'

@inject()
export default class UsersController {
  constructor(private readonly service: UserService) {}

  async index(ctx: HttpContext) {
    const searchTerm = ctx.request.qs().search || ''
    const page = ctx.request.qs().page || 1
    return this.service.index(searchTerm, { page, limit: 5 })
  }

  async show(ctx: HttpContext): Promise<
    | string
    | PageObject<{
        user: UserResponse
      }>
  > {
    const user = await this.service.serialize(ctx.auth.user!)
    return ctx.inertia.render('users/settings', { user })
  }

  async update(ctx: HttpContext) {
    const user = ctx.auth.user!

    try {
      const data = await ctx.request.validateUsing(updateUserValidator, {
        meta: {
          userId: user.id,
        },
      })

      await this.service.update(user, {
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email,
      })

      await this.service.storeAttachments(ctx)

      return ctx.inertia.render('users/settings')
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        ctx.session.flash('errors', reducedErrors)
      }

      return ctx.response.redirect().back()
    }
  }

  async destroy() {
    // TODO: Implement.
  }
}
