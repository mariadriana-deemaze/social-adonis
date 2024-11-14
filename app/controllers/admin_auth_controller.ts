import AdminAuthService from '#services/admin_auth_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdminAuthController {
  constructor(protected readonly service: AdminAuthService) {}

  async show(ctx: HttpContext) {
    return await this.service.show(ctx)
  }

  async destroy(ctx: HttpContext) {
    return await this.service.destroy(ctx)
  }
}
