/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const OAuthController = () => import('#controllers/o_auth_controller')
const UsersController = () => import('#controllers/users_controller')
const UserFollowsController = () => import('#controllers/user_follows_controller')
const UserNotificationsController = () => import('#controllers/user_notifications_controller')
const PostsController = () => import('#controllers/posts_controller')
const PostReactionsController = () => import('#controllers/post_reactions_controller')
const PostPinsController = () => import('#controllers/post_pins_controller')
const PostCommentsController = () => import('#controllers/post_comments_controller')
const PostReportsController = () => import('#controllers/post_reports_controller')
const FeedController = () => import('#controllers/feed_controller')
const AdminAuthController = () => import('#controllers/admin_auth_controller')
const AdminPostReportsController = () => import('#controllers/admin_post_reports_controller')

/**
 *
 * PUBLIC
 *
 **/
router
  .group(() => {
    router.on('/').renderInertia('home').as('home.show')
    router.get('/feed', [FeedController, 'index']).as('feed.show')
    router
      .group(() => {
        router.get('/', [UsersController, 'index']).as('users.index')
        router.get(':id', [FeedController, 'show']).as('users.show')
      })
      .where('id', router.matchers.uuid())
      .prefix('users')

    router
      .group(() => {
        router.get(':id', [PostsController, 'show']).as('posts.show')
        router.get(':postId/comments', [PostCommentsController, 'index']).as('posts_comments.index')
        router
          .get(':postId/comments/:id', [PostCommentsController, 'show'])
          .as('posts_comments.show')
      })
      .where('id', router.matchers.uuid())
      .where('postId', router.matchers.uuid())
      .prefix('posts')
  })
  .use(middleware.guest())

/**
 *
 * Auth
 *
 * */
router
  .group(() => {
    router.post('sign-up', [AuthController, 'store']).as('auth.store')
    router.on('sign-up').renderInertia('sign_up')
    router.post('sign-in', [AuthController, 'show']).as('auth.show')
    router.on('sign-in').renderInertia('sign_in')
    router.post('reset-password', [AuthController, 'reset']).as('auth.reset')
    router.on('reset-password').renderInertia('reset_password')
    router.post('change-password', [AuthController, 'update']).as('auth.update')
    router.on('change-password').renderInertia('change_password')
    router
      .get('/:provider/redirect', [OAuthController, 'redirect'])
      .where('provider', /github|google/)
      .as('auth.redirect')
    router
      .get('/:provider/callback', [OAuthController, 'callback'])
      .where('provider', /github|google/)
      .as('auth.callback')
  })
  .prefix('auth')
  .use(middleware.guest())

/**
 *
 * PRIVATE AND USER RELATED
 *
 **/
router
  .group(() => {
    router.delete('auth/sign-out', [AuthController, 'destroy']).as('auth.destroy')

    router
      .group(() => {
        router.get('/', [UserNotificationsController, 'index']).as('notifications.index')
        router.post('/', [UserNotificationsController, 'update']).as('notifications.update')
      })
      .prefix('notifications')

    router
      .group(() => {
        router.patch('/', [UsersController, 'update']).as('users.update')
        router.delete('/', [UsersController, 'destroy']).as('users.destroy')

        router.get('follow/:userId', [UserFollowsController, 'show']).as('users_follows.show')
        router.post('follow/:userId', [UserFollowsController, 'store']).as('users_follows.store')
        router
          .delete('follow/:userId', [UserFollowsController, 'destroy'])
          .as('users_follows.destroy')
      })
      .where('userId', router.matchers.uuid())
      .prefix('users')

    router.get('settings', [UsersController, 'show']).as('settings.show')

    router
      .group(() => {
        router.post('/', [PostsController, 'store']).as('posts.store')
        router.patch(':id', [PostsController, 'update']).as('posts.update')
        router.delete(':id', [PostsController, 'destroy']).as('posts.destroy')

        router
          .post(':postId/comments', [PostCommentsController, 'store'])
          .as('posts_comments.store')
        router
          .patch(':postId/comments/:id', [PostCommentsController, 'update'])
          .as('posts_comments.update')
        router
          .delete(':postId/comments/:id', [PostCommentsController, 'destroy'])
          .as('posts_comments.destroy')

        router.post(':id/pin', [PostPinsController, 'update']).as('posts_pins.update')

        router.post(':id/react', [PostReactionsController, 'create']).as('posts_reactions.store')
        router
          .delete(':id/react', [PostReactionsController, 'destroy'])
          .as('posts_reactions.destroy')

        router.get(':id/report', [PostReportsController, 'show']).as('posts_reports.show')
        router.post(':id/report', [PostReportsController, 'store']).as('posts_reports.store')
        router.put(':id/report', [PostReportsController, 'update']).as('posts_reports.update')
        router.delete(':id/report', [PostReportsController, 'destroy']).as('posts_reports.destroy')
      })
      .where('id', router.matchers.uuid())
      .where('postId', router.matchers.uuid())
      .prefix('posts')
  })
  .use(middleware.auth())

/**
 *
 * Admin Auth
 *
 * */
router
  .group(() => {
    router
      .group(() => {
        router.post('sign-in', [AdminAuthController, 'show']).as('admin.show')
        router.on('sign-in').renderInertia('admin/sign_in')
      })
      .prefix('auth')

    /**
     * Admin protected
     */
    router
      .group(() => {
        router.delete('auth/sign-out', [AdminAuthController, 'destroy']).as('admin_auth.destroy')
        router.on('index').renderInertia('admin/index').as('admin.index')
        router
          .group(() => {
            router
              .get('reports', [AdminPostReportsController, 'index'])
              .as('admin_posts_reports.index')
            router
              .put('reports/:id', [AdminPostReportsController, 'update'])
              .as('admin_posts_reports.update')
          })
          .where('id', router.matchers.uuid())
          .prefix('posts')
      })
      .use(middleware.auth({ guards: ['admin-web'] }))
  })
  .prefix('admin')
