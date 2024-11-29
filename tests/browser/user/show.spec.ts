import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { route } from '@izzyjs/route/client'
import { test } from '@japa/runner'

test.group('Acessing user profile feed', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('Successfully acesses the user profile feed without being authenticated', async ({
    visit,
  }) => {
    const user = await UserFactory.create()
    const url = route('users.show', {
      params: {
        id: user.id,
      },
    }).path
    const page = await visit(url)
    await page.assertTextContains('body', 'Sign in')
    await page.assertPath(url)
  })

  test('Successfully acesses own user profile feed while authenticated', async ({
    visit,
    browserContext,
  }) => {
    const user = await UserFactory.with('posts', 2).create()
    await browserContext.withGuard('web').loginAs(user)
    const page = await visit(
      route('users.show', {
        params: {
          id: user.id,
        },
      }).path
    )
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
    const page = await visit(
      route('users.show', {
        params: {
          id: otherUser.id,
        },
      }).path
    )
    const locator = page.getByText('Total posts').first()
    await page.assertText(locator, `Total posts ${otherUser.posts.length}`)
  })
})
