import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Acessing user profile feed', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('Fails to access the user profile feed without being authenticated', async ({ visit }) => {
    const user = await UserFactory.create()
    const page = await visit(`/users/${user.id}`)
    await page.assertTextContains('body', 'Sign in')
  })

  test('Successfully acesses own user profile feed while authenticated', async ({
    visit,
    browserContext,
  }) => {
    const user = await UserFactory.with('posts', 2).create()
    await browserContext.loginAs(user)
    const page = await visit(`/users/${user.id}`)
    const locator = page.getByText('Total posts').first()
    await page.assertText(locator, `Total posts ${user.posts.length}`)
  })

  test('Successfully acesses other user profile feed while authenticated', async ({
    visit,
    browserContext,
  }) => {
    const user = await UserFactory.with('posts', 2).create()
    const otherUser = await UserFactory.with('posts', 8).create()
    await browserContext.loginAs(user)
    const page = await visit(`/users/${otherUser.id}`)
    const locator = page.getByText('Total posts').first()
    await page.assertText(locator, `Total posts ${otherUser.posts.length}`)
  })
})
