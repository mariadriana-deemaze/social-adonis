import type { HttpContext } from '@adonisjs/core/http'
import { createAuthValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthService {
  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createAuthValidator)

    const existant = await User.query().where('email', payload.email).first()
    if (existant) {
      return response
        .status(200)
        .json({ message: 'An User with the provided email already exists.' })
    }

    const user = new User()
    Object.assign(user, payload)
    await user.save()

    return response.status(201).json({ message: 'User created successfully!' })
  }

  async show({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    if (!user) {
      return response.status(401).json({ message: 'Invalid credentials - Unauthorized.' })
    }
    return await User.accessTokens.create(user)
  }
}
