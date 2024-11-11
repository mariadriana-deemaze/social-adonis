import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Acessing feed', (group) => {

  group.each.setup(() => testUtils.db().truncate())

  test('Fails to access the feed without being authenticated', async ({ visit }) => {
    const page = await visit('/feed')
    await page.assertTextContains('body', 'Sign in')
  })

  test('Successfully acesses the feed while authenticated', async ({ visit, browserContext }) => {
    const user = await UserFactory.create()
    const created = await UserFactory.with('posts', 8).create()
    await browserContext.loginAs(user)
    const page = await visit('/feed')
    const locator = page.locator('.feed-list > article > .post-content')
    await page.assertElementsText(locator, created.posts.map((post) => post.content))
  })

  test('Successfully creates a post', async ({ visit, browserContext }) => {
    const user = await UserFactory.create()
    await UserFactory.with('posts', 8).create()

    await browserContext.loginAs(user)
    const page = await visit('/feed')
    await page.locator('button.create-post').click();

    const postContent = 'Lets get dat bread! 🍞';
    await page.locator('textarea').fill(postContent);
    await page.getByText('Publish').click();
    const locator = page.locator('.feed-list > article:nth-child(1) > .post-content')
    await page.assertElementsText(locator, [postContent])
  })

  test('Successfully updates a post', async ({ visit, browserContext }) => {
    const user = await UserFactory.with('posts', 1).create()
    await UserFactory.with('posts', 8).create()

    await browserContext.loginAs(user)
    const page = await visit(`/posts/${user.posts[0].id}`)

    await page.locator('button.trigger-user-post-actions').click();
    const updateButton = page.locator('button.update-post-trigger');
    updateButton.click();
    const postContent = 'Lets get dat bread! 🍞';
    await page.locator('textarea').fill(postContent);
    await page.getByRole('button', { name: 'Update' }).click();
    const locator = page.locator('.post-content')
    await page.assertElementsText(locator, [postContent])
  })

  test('Successfully deletes a post', async ({ visit, browserContext }) => {
    const user = await UserFactory.with('posts', 1).create()
    await UserFactory.with('posts', 8).create()
    
    await browserContext.loginAs(user)
    const page = await visit(`/posts/${user.posts[0].id}`)
    
    await page.locator('button.trigger-user-post-actions').click();
    const deleteButton = page.locator('button.delete-post-trigger');
    deleteButton.click();
    await page.getByRole('button', { name: 'Delete post' }).click();
    await page.waitForURL('**/feed');
  })

  test('Unable to access update/delete actions of non-authored post', async ({ visit, browserContext }) => {
    const user = await UserFactory.with('posts', 1).create()
    const otherUser = await UserFactory.with('posts', 8).create()
    await browserContext.loginAs(user)
    const page = await visit(`/posts/${otherUser.posts[0].id}`);
    const actionsBtn = page.locator('button.trigger-user-post-actions');
    await page.assertNotExists(actionsBtn);
  })
})
