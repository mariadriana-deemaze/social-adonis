import { UserFactory } from '#database/factories/user_factory';
import User from '#models/user';
import testUtils from '@adonisjs/core/services/test_utils';
import { faker } from '@faker-js/faker';
import { test } from '@japa/runner'

test.group('Post report', (group) => {

  let user: User | null = null;
  let url = '/posts/:id'

  group.each.setup(async () => {
    await testUtils.db().truncate()
    user = await UserFactory.create()
  })

  test('Successfuly creates a post report', async ({ browserContext, visit }) => {
    const authUser = user!;
    const otherUser = await UserFactory.with('posts', 1).create()
    url.replace(':id', otherUser.posts[0].id)
    await browserContext.loginAs(authUser)

    const page = await visit(url)
    await page.locator('button.trigger-user-post-actions').click()
    await page.locator('button.report-post-trigger').click()
    await page.locator('button.select-reason').click() // FIX-ME: Review these tag classes. Too cumbersome.
    await page.locator('#reason-adultery').click()
    await page.locator('textarea#description').fill(faker.lorem.paragraph())
    await page.getByRole('button', { name: 'Report post' }).click()
    const success = page.locator('h1.font-bold');
    await page.assertElementsText(success, ['Thank you for reporting'])
  })

  test('Successfuly updates a post report', async ({ browserContext, visit }) => {
    const authUser = user!;
    const userPostReport = await UserFactory.with('posts', 1, (post) => post.with('reports', 1, (report) => report.merge({
      userId: authUser.id!
    }))).create()
    url.replace(':id', userPostReport.posts[0].id)
    await browserContext.loginAs(authUser)

    const page = await visit(url)
    await page.locator('button.trigger-user-post-actions').click()
    await page.locator('button.report-post-trigger').click()
    await page.assertSelectedOptions('select', [userPostReport.posts[0].reports[0].reason]);
    await page.assertInputValue('textarea#description', userPostReport.posts[0].reports[0].description);
    await page.locator('button.select-reason').click() // FIX-ME: Review these tag classes. Too cumbersome.
    await page.locator('#reason-adultery').click()
    await page.locator('textarea#description').fill(faker.lorem.paragraph())
    await page.getByRole('button', { name: 'Update report' }).click()
    const success = page.locator('h1.font-bold');
    await page.assertElementsText(success, ['Thank you for reporting'])
  })
})
