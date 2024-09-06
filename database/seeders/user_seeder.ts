import User, { AccountRole } from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import hash from '@adonisjs/core/services/hash'
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
      password: await hash.make('take1WildGuess!'),
      role: AccountRole.ADMIN
    }

    let data = [...users, admin]
    for (const user of data) {
      user.password = await hash.make(user.password)
    }

    await User.createMany(data)
  }
}
