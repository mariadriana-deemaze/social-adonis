import User from '#models/user'
import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'

test.group('Acessing feed', () => {
  test('Attempt to access the feed without being authenticated', async ({ visit }) => {
    const page = await visit('/feed')
    await page.assertTextContains('body', 'Sign in')
  })
  test('Attempt to access the feed while authenticated', async ({
    visit,
    browserContext,
  }) => {
    const user = await User.create({
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })
    await browserContext.loginAs(user)
    const page = await visit('/feed')
    await page.assertTextContains('body', 'It works!')
  })
})
