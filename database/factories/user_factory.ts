import factory from '@adonisjs/lucid/factories'
import User, { AccountRole } from '#models/user'
import { PostFactory } from '#database/factories/post_factory'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      role: AccountRole.USER,
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .state('admin', (user) => (user.role = AccountRole.ADMIN))
  .relation('posts', () => PostFactory)
  .build()
