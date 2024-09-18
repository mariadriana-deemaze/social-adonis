import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { PostFactory } from '#database/factories/post_factory'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .relation('posts', () => PostFactory)
  .build()
