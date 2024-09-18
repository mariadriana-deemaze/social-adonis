import { UserFactory } from '#database/factories/user_factory'
import { test } from '@japa/runner'

test.group('Acessing feed', () => {
  test('Attempt to access the feed without being authenticated', async ({ visit }) => {
    const page = await visit('/feed')
    await page.assertTextContains('body', 'Sign in')
  })
  test('Attempt to access the feed while authenticated', async ({ visit, browserContext }) => {
    const user = await UserFactory.create()
    await UserFactory.with('posts', 8).create()
    await browserContext.loginAs(user)
    const page = await visit('/feed')
    await page.assertTextContains('body', 'It works!')

    const testing = await page.getAttribute('class', '.feed-list')
    console.log('element ->', JSON.stringify(testing))
  })
})
