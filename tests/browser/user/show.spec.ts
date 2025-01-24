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

  test('Fails to detect follow action on a user profile feed while being un-authenticated', async ({
    visit,
  }) => {
    await UserFactory.create()
    const otherUser = await UserFactory.create()
    const page = await visit(
      route('users.show', {
        params: {
          id: otherUser.id,
        },
      }).path
    )
    const followButton = page.locator('button.follow-action')
    await page.assertNotExists(followButton)
  })

  test('Fails to detect follow action on own user profile feed while authenticated', async ({
    visit,
    browserContext,
  }) => {
    const user = await UserFactory.create()
    await browserContext.loginAs(user)
    const page = await visit(
      route('users.show', {
        params: {
          id: user.id,
        },
      }).path
    )
    const followButton = page.locator('button.follow-action')
    await page.assertNotExists(followButton)
  })

  test('Successfully follows and unfollows another user profile feed while authenticated', async ({
    visit,
    browserContext,
  }) => {
    const user = await UserFactory.create()
    const otherUser = await UserFactory.create()
    await browserContext.loginAs(user)
    const page = await visit(
      route('users.show', {
        params: {
          id: otherUser.id,
        },
      }).path
    )

    const followButton = page.locator('button.follow-action').nth(1)
    const followersCount = page.locator('p.user-profile-card-total-followers').nth(1)

    page.assertText(followButton, 'Follow')
    page.assertText(followersCount, 'Followers 0')

    const followPromise = page.waitForRequest(
      (request) =>
        request.url().includes(
          route('users_follows.store', {
            params: {
              userId: otherUser.id,
            },
          }).path
        ) && request.method() === 'POST'
    )
    await followButton.click()
    await followPromise.then(async (request) => await request.response())

    page.assertText(followButton, 'Unfollow')
    page.assertText(followersCount, 'Followers 1')
  })
})
