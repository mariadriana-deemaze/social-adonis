import { GithubDriver } from '@adonisjs/ally/drivers/github'
import { GoogleDriver } from '@adonisjs/ally/drivers/google'
import type { HttpContext } from '@adonisjs/core/http'

export default class OAuthController {
  async redirect({ ally, params, response }: HttpContext) {
    const driver: GithubDriver | GoogleDriver = ally.use(params.provider)
    if (!(driver instanceof GithubDriver) && !(driver instanceof GoogleDriver)) {
      return response.notFound()
    }
    return driver.redirect()
  }

  async callback({ ally, params, response }: HttpContext) {
    const driver = ally.use(params.provider)
    if (!(driver instanceof GithubDriver) && !(driver instanceof GoogleDriver)) {
      return response.notFound()
    }
    console.log('driver ->', driver)
    // @ts-ignore
    const user = await driver.user()
    console.log('user ->', user)
  }
}
