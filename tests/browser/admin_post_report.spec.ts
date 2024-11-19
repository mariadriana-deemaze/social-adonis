import { UserFactory } from '#database/factories/user_factory'
import { PostReportReason, PostReportStatus } from '#enums/post'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Admin post report', (group) => {
  // FIX-ME: Izzy
  const url = '/admin/posts/reports'

  group.each.setup(() => testUtils.db().truncate())

  test('Successfully filters the report complaint list', async ({
    browserContext,
    assert,
    visit,
  }) => {
    const adminUser = await UserFactory.apply('admin').create()!
    const reportingUser = await UserFactory.create()!
    const postingUser = await UserFactory.with('posts', 1).create()!

    await browserContext.withGuard('admin-web').loginAs(adminUser)
    const page = await visit(url)

    const userPostReport = await UserFactory.with('posts', 1, (post) =>
      post.with('reports', 1, (report) =>
        report.merge({
          userId: reportingUser.id!,
          postId: postingUser.posts[0].id,
          reason: PostReportReason.ADULTERY,
          status: PostReportStatus.ACCEPTED,
        })
      )
    ).create()

    await page.locator('button#reason').click()
    await page.getByText(PostReportReason.ADULTERY.toLowerCase(), { exact: true }).click()

    await page.locator('button#status').click()
    await page.getByText(PostReportStatus.ACCEPTED.toLowerCase(), { exact: true }).click()

    await page.locator('form button').last().click()

    const firstRow = page.locator('table tbody > tr').first()
    const firstRowPostContent = await firstRow.locator('.report-post-content').textContent()
    const paginatorContent = await page
      .locator('p.default-paginator-total')
      .textContent()
      .then((value) => (value ? Number(value?.split(' ')[0]) : 0))
    assert.equal(paginatorContent, 1)
    assert.equal(firstRowPostContent, userPostReport.posts[0].content)
  })

  test('Successfully accepts a report complaint', async ({ assert, browserContext, visit }) => {
    const adminUser = await UserFactory.apply('admin').create()!
    const reportingUser = await UserFactory.create()!
    const postingUser = await UserFactory.with('posts', 1).create()!
    await UserFactory.with('posts', 1, (post) =>
      post.with('reports', 1, (report) =>
        report.merge({
          userId: reportingUser.id!,
          postId: postingUser.posts[0].id,
          reason: PostReportReason.ADULTERY,
          status: PostReportStatus.PENDING,
        })
      )
    ).create()

    await browserContext.withGuard('admin-web').loginAs(adminUser)
    const page = await visit(url)

    page.locator('table tbody > tr').first()
    await page.locator('button.report-update-action-trigger').click()
    await page.locator('button.select-reason').click()
    await page
      .getByLabel(PostReportStatus.ACCEPTED.toLowerCase())
      .getByText(PostReportStatus.ACCEPTED.toLowerCase())
      .click()
    await page.getByRole('button', { name: 'Update' }).click()
    const reportStatus = await page.locator('table tbody > tr .report-status').first().textContent()
    assert.equal(reportStatus, PostReportStatus.ACCEPTED)
  })

  test('Successfully rejects a report complaint', async ({ assert, browserContext, visit }) => {
    const adminUser = await UserFactory.apply('admin').create()!
    const reportingUser = await UserFactory.create()!
    const postingUser = await UserFactory.with('posts', 1).create()!
    await UserFactory.with('posts', 1, (post) =>
      post.with('reports', 1, (report) =>
        report.merge({
          userId: reportingUser.id!,
          postId: postingUser.posts[0].id,
          reason: PostReportReason.ADULTERY,
          status: PostReportStatus.PENDING,
        })
      )
    ).create()

    await browserContext.withGuard('admin-web').loginAs(adminUser)
    const page = await visit(url)

    page.locator('table tbody > tr').first()
    await page.locator('button.report-update-action-trigger').click()
    await page.locator('button.select-reason').click()
    await page
      .getByLabel(PostReportStatus.REJECTED.toLowerCase())
      .getByText(PostReportStatus.REJECTED.toLowerCase())
      .click()
    await page.getByRole('button', { name: 'Update' }).click()
    const reportStatus = await page.locator('table tbody > tr .report-status').first().textContent()
    assert.equal(reportStatus, PostReportStatus.REJECTED)
  })
})
