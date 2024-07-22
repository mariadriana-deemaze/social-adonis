import type { HttpContext } from '@adonisjs/core/http'
import { createAuthValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthService {
  async create({ request, inertia }: HttpContext) {
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
    const tokens = await User.accessTokens.create(user)
    return inertia.render('feed', { user: user.toJSON(), tokens })
  }

  async show({ request, inertia }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const user = await User.verifyCredentials(email, password)
      const tokens = await User.accessTokens.create(user)
      return inertia.render('feed', { user: user.toJSON(), tokens })
    } catch (error) {
      if (error.code === 'E_INVALID_CREDENTIALS') {
        return inertia.render('sign-in', { errors: { email: ['Invalid credentials'] } })
      }
      return inertia.render('home')
    }
  }
}
