import { PostCommentFactory } from '#database/factories/post_comment_factory'
import { PostFactory } from '#database/factories/post_factory'
import { UserFactory } from '#database/factories/user_factory'
import PostComment from '#models/post_comment'
import User from '#models/user'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

const getExpectedMatches = (users: User[], searchRegExp: RegExp) =>
  users.filter((user) => searchRegExp.test(user.username) || searchRegExp.test(user.name || ''))

test.group('PostComment/index', (group) => {
  let postComments: PostComment[] = []
  let service: PostCommentService = new PostCommentService(new UserService())

  group.each.setup(async () => {
    await testUtils.db().truncate()
    postComments = await PostCommentFactory.makeStubbedMany(20)
    //postComments = await PostCommentFactory.apply('posted').with('user').with('post').createMany(20)
    //postComments = await UserFactory.with('posts', 20, (post) => post.with('comments'))
  })

  test('Successfully returns a list of post comments from the provided params', async ({
    assert,
  }) => {
    const perPage = 5
    const post = (await UserFactory.with('posts').create()).posts[0]
    const query = await service.index(post.id, { currentPage: 1, limit: perPage })
    assert.properties(query, ['data', 'meta'])
    assert.containsSubset(query, {
      meta: {
        total: 20,
        perPage: perPage,
      },
    })
    console.log('query ->', query)
    assert.equal(query.data.length, perPage)
  })

  test('Successfully returns a post comment from the provided params', async ({ assert }) => {
    /* const user = users[0]
    user.name = 'Johnny Bravo'
    user.username = 'bravissimo87'
    await user.save()

    const perPage = 5
    const searchTerm = 'bravissimo8'
    const searchRegExp = new RegExp(searchTerm)
    const query = await service.search(searchTerm, { page: 1, limit: perPage })
    const expectedMatches = getExpectedMatches(users, searchRegExp)
    assert.properties(query, ['data', 'meta'])
    assert.containsSubset(query, {
      meta: {
        total: expectedMatches.length,
        perPage: perPage,
      },
    })
    assert.equal(query.data.length, expectedMatches.length) */
  })

  test('Successfully fails to retuns a list of post comments from the provided params', async ({
    assert,
  }) => {
    /* const perPage = 10
    const searchTerm = 'will_not_match'
    const searchRegExp = new RegExp(searchTerm)
    const query = await service.search(searchTerm, { page: 1, limit: perPage })
    const expectedMatches = getExpectedMatches(users, searchRegExp)
    assert.properties(query, ['data', 'meta'])
    assert.containsSubset(query, {
      meta: {
        total: expectedMatches.length,
        perPage: perPage,
      },
    })
    assert.equal(query.data.length, expectedMatches.length) */
  })
})
