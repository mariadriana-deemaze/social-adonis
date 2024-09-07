import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}
  async store(ctx: HttpContext) {
    return await this.authService.create(ctx)
  }

  async show(ctx: HttpContext) {
    return await this.authService.show(ctx)
  }

  async destroy(ctx: HttpContext) {
    return await this.authService.destroy(ctx)
  }
}
