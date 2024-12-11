import User from '#models/user'
import AuthService from '#services/auth_service'
import { randomPasswordGenerator } from '#utils/index'
import { GithubDriver } from '@adonisjs/ally/drivers/github'
import { GoogleDriver } from '@adonisjs/ally/drivers/google'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class OAuthController {
  constructor(private readonly authService: AuthService) {}

  async redirect(ctx: HttpContext): Promise<void> {
    const driver = this.getDriver(ctx)
    if (!driver) return ctx.response.notFound()
    return driver.redirect()
  }

  async callback(ctx: HttpContext): Promise<void> {
    const driver = this.getDriver(ctx)
    if (!driver) return ctx.response.notFound()

    const details = await driver.user()

    let user = await User.firstOrCreate(
      {
        email: details.email,
      },
      {
        name: String(details.name).split(' ')[0],
        surname: String(details.name).split(' ')[1] ?? '',
        email: details.email,
        password: await hash.make(randomPasswordGenerator()),
      }
    )

    await this.authService.authenticate(ctx, user)
  }

  private getDriver({ ally, params }: HttpContext): GithubDriver | GoogleDriver | null {
    const driver: GithubDriver | GoogleDriver = ally.use(params.provider)
    if (!(driver instanceof GithubDriver) && !(driver instanceof GoogleDriver)) {
      return null
    }
    return driver
  }
}
