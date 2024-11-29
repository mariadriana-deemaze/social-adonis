import UsersController from '#controllers/users_controller'
import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { InferPageProps, SharedProps } from '@adonisjs/inertia/types'
import { faker } from '@faker-js/faker'
import { route } from '@izzyjs/route/client'
import { test } from '@japa/runner'

test.group('User settings', (group) => {
  let user: User | null = null
  let url = route('settings.show').path

  group.each.setup(async () => {
    await testUtils.db().truncate()
    user = await UserFactory.create()
  })

  test('Sucessfully updates profile', async ({ visit, browserContext, assert }) => {
    const authUser = user!
    await browserContext.loginAs(authUser)
    const page = await visit(url)

    const data = {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
    }

    await page.locator('input#name').fill(data.name)
    await page.locator('input#surname').fill(data.surname)
    await page.locator('input#email').fill(data.email)
    await page.locator('input#username').fill(data.username)

    const responsePromise = page.waitForResponse(url)
    await page.getByRole('button', { name: 'Update' }).click()
    const response = await responsePromise
    const json: { props: InferPageProps<UsersController, 'update'> & SharedProps } =
      await response.json()
    assert.equal(data.name, json.props.user?.name)
    assert.equal(data.surname, json.props.user?.surname)
    assert.equal(data.username, json.props.user?.username)
    assert.equal(data.email, json.props.user?.email)
    assert.isUndefined(json.props?.errors)
  })

  test('Fails to update profile', async ({ visit, browserContext, assert }) => {
    const authUser = user!
    await browserContext.loginAs(authUser)
    const page = await visit(url)

    const data = {
      name: faker.person.firstName() + '1',
      surname: faker.person.lastName() + '1',
      email: faker.internet.email(),
      username: faker.internet.userName() + '  ' + '1',
    }

    await page.locator('input#name').fill(data.name)
    await page.locator('input#surname').fill(data.surname)
    await page.locator('input#email').fill(data.email)
    await page.locator('input#username').fill(data.username)

    const responsePromise = page.waitForResponse(url)
    await page.getByRole('button', { name: 'Update' }).click()
    const response = await responsePromise
    const json: { props: InferPageProps<UsersController, 'update'> & SharedProps } =
      await response.json()

    assert.notEqual(data.name, json.props.user?.name)
    assert.notEqual(data.surname, json.props.user?.surname)
    assert.notEqual(data.username, json.props.user?.username)
    assert.notEqual(data.email, json.props.user?.email)
    assert.isObject(json.props?.errors)
    assert.containsSubset(json.props?.errors, {
      username: 'The username field format is invalid',
      name: 'The name field format is invalid',
      surname: 'The surname field format is invalid',
    })
  })
})
