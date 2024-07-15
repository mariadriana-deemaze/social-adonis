import type { HttpContext } from '@adonisjs/core/http'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import AuthService from '#services/auth_service'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}
  async store(ctx: HttpContext): Promise<void> {
    return await this.authService.create(ctx)
  }

  async show(ctx: HttpContext): Promise<void | AccessToken> {
    return await this.authService.show(ctx)
  }

  async destroy({}: HttpContext) {}
}
