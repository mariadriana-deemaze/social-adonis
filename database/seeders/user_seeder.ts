import User, { AccountRole } from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker/locale/en_GB'

export default class extends BaseSeeder {
  async run() {
    const users = [...Array(10)].map(() => {
      return {
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        password: "user_password",
      }
    })

    const admin = {
      name: 'Admin user',
      email: 'admin_user@gmail.com',
      password: 'take1WildGuess!',
      role: AccountRole.ADMIN
    }

    await User.createMany([...users, admin])
  }
}
