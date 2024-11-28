import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { route } from '@izzyjs/route/client'
import { test } from '@japa/runner'

test.group('Acessing post/show', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('Fails to access the user post without being authenticated', async ({ visit }) => {
    const user = await UserFactory.with('posts', 1, (post) => post.apply('unpinned')).create()
    const page = await visit(
      route('posts.show', {
        params: {
          id: user.posts[0].id,
        },
      }).path
    )
    await page.assertTextContains('body', 'Sign in')
  })

  test('Successfully acesses the user post while authenticated', async ({
    assert,
    visit,
    browserContext,
  }) => {
    const user = await UserFactory.with('posts', 1, (post) => post.apply('unpinned')).create()
    await browserContext.withGuard('web').loginAs(user)
    const page = await visit(
      route('posts.show', {
        params: {
          id: user.posts[0].id,
        },
      }).path
    )
    const content = await page.locator('div.post-content').innerText()
    assert.equal(content, user.posts[0].content)
  })

  test('Successfully pins post while authenticated', async ({ visit, browserContext }) => {
    const user = await UserFactory.with('posts', 1, (post) => post.apply('unpinned')).create()
    await browserContext.withGuard('web').loginAs(user)
    const page = await visit(
      route('posts.show', {
        params: {
          id: user.posts[0].id,
        },
      }).path
    )
    await page.locator('button.trigger-user-post-actions').click()
    await page.locator('button.pin-post-trigger').click()
    await page.assertExists('div#pinned-post-icon')
  })

  test('Successfully unpins post while authenticated', async ({ visit, browserContext }) => {
    const user = await UserFactory.with('posts', 1, (post) => post.apply('pinned')).create()
    await browserContext.withGuard('web').loginAs(user)
    const page = await visit(
      route('posts.show', {
        params: {
          id: user.posts[0].id,
        },
      }).path
    )
    await page.locator('button.trigger-user-post-actions').click()
    await page.locator('button.pin-post-trigger').click()
    await page.assertNotExists('div#pinned-post-icon')
  })
})
