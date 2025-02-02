import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import mail from '@adonisjs/mail/services/main'
import { route } from '@izzyjs/route/client'
import { test } from '@japa/runner'

test.group('Acessing feed', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('Successfully acesses the feed without being authenticated', async ({ visit }) => {
    const url = route('feed.show').path
    const page = await visit(url)
    await page.assertTextContains('body', 'Sign in')
    await page.assertPath(url)
  })

  test('Successfully acesses the feed while authenticated', async ({ visit, browserContext }) => {
    const user = await UserFactory.create()
    const created = await UserFactory.with('posts', 8).create()
    await browserContext.loginAs(user)
    const page = await visit(route('feed.show').path)
    const locator = page.locator('.feed-list > article > .post-content')
    await page.assertElementsText(
      locator,
      created.posts.map((post) => post.content)
    )
  })

  test('Successfully creates a post', async ({ visit, browserContext }) => {
    const user = await UserFactory.create()
    await UserFactory.with('posts', 8).create()

    await browserContext.loginAs(user)
    const page = await visit(route('feed.show').path)
    await page.locator('button.create-post').click()

    const postContent = 'Lets get dat bread! 🍞'
    await page.locator('textarea#content').fill(postContent)
    await page.getByText('Publish').click()
    const locator = page.locator('.feed-list > article:nth-child(1) > .post-content')
    await page.assertElementsText(locator, [postContent])
  })

  test('Successfully updates a post', async ({ visit, browserContext }) => {
    const user = await UserFactory.with('posts', 1).create()
    await UserFactory.with('posts', 8).create()

    await browserContext.loginAs(user)
    const page = await visit(
      route('posts.show', {
        params: {
          id: user.posts[0].id,
        },
      }).path
    )

    await page.locator('button.trigger-user-post-actions').click()
    const updateButton = page.locator('button.update-post-trigger')
    updateButton.click()
    const postContent = 'Lets get dat bread! 🍞'
    await page.locator('textarea#content').fill(postContent)
    await page.getByRole('button', { name: 'Update' }).click()
    const locator = page.locator('.post-content')
    await page.assertElementsText(locator, [postContent])
  })

  test('Successfully deletes a post', async ({ visit, browserContext }) => {
    const user = await UserFactory.with('posts', 1).create()
    await UserFactory.with('posts', 8).create()

    await browserContext.loginAs(user)
    const page = await visit(
      route('posts.show', {
        params: {
          id: user.posts[0].id,
        },
      }).path
    )

    await page.locator('button.trigger-user-post-actions').click()
    const deleteButton = page.locator('button.delete-post-trigger')
    deleteButton.click()
    await page.getByRole('button', { name: 'Delete post' }).click()
    await page.waitForURL('**/feed')
  })

  test('Unable to access update/delete actions of non-authored post', async ({
    visit,
    browserContext,
  }) => {
    const user = await UserFactory.with('posts', 1).create()
    const otherUser = await UserFactory.with('posts', 8).create()
    await browserContext.loginAs(user)
    const page = await visit(
      route('posts.show', {
        params: {
          id: otherUser.posts[0].id,
        },
      }).path
    )
    await page.locator('button.trigger-user-post-actions').click()
    const updateAction = page.locator('button.update-post-trigger')
    const deleteAction = page.locator('button.delete-post-trigger')
    await page.assertNotExists(updateAction)
    await page.assertNotExists(deleteAction)
  })

  test('Successfully reacts to a post', async ({ visit, browserContext, cleanup }) => {
    mail.fake()

    const user = await UserFactory.with('posts', 1).create()
    const otherUser = await UserFactory.with('posts', 8).create()

    await browserContext.loginAs(user)
    const page = await visit(
      route('posts.show', {
        params: {
          id: otherUser.posts[0].id,
        },
      }).path
    )

    const reactButton = page.locator('button.trigger-user-post-react')
    await reactButton.hover()
    const funnyReaction = page.locator('button.react-funny')
    const funnyCount = page.locator('button.react-funny > span')

    // React
    const funnyReactionPromise = page.waitForRequest(
      (request) =>
        request.url().includes(
          route('posts_reactions.store', {
            params: {
              id: otherUser.posts[0].id,
            },
          }).path
        ) && request.method() === 'POST'
    )
    await funnyReaction.click()
    await funnyReactionPromise.then(async (request) => await request.response())
    const status = page.locator('p.user-post-react-status')
    await page.assertElementsText(status, ['You reacted.'])
    await page.assertElementsText(funnyCount, ['1'])

    // Unreact
    await reactButton.hover()
    const funnyUnreactionPromise = page.waitForRequest(
      (request) =>
        request.url().includes(
          route('posts_reactions.store', {
            params: {
              id: otherUser.posts[0].id,
            },
          }).path
        ) && request.method() === 'DELETE'
    )
    await funnyReaction.click()
    await funnyUnreactionPromise.then(async (request) => await request.response())
    await page.assertElementsText(status, ['No reactions.'])
    await page.assertElementsText(funnyCount, ['0'])

    cleanup(() => {
      mail.restore()
    })
  })
})
