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
const FeedController = () => import('#controllers/feed_controller')
const PostsController = () => import('#controllers/posts_controller')
const UsersController = () => import('#controllers/users_controller')
const PostReactionsController = () => import('#controllers/post_reactions_controller')
const PostReportsController = () => import('#controllers/post_reports_controller')
const AdminAuthController = () => import('#controllers/admin_auth_controller')
const AdminPostReportsController = () => import('#controllers/admin_post_reports_controller')

/**
 *
 * PUBLIC
 *
 **/
router
  .group(() => {
    router.on('/').renderInertia('home')
    router.get('/feed', [FeedController, 'index'])
  })
  .use(middleware.guest())

/**
 *
 * Auth
 *
 * */
router
  .group(() => {
    router.post('/sign-up', [AuthController, 'store'])
    router.on('/sign-up').renderInertia('sign_up')
    router.post('/sign-in', [AuthController, 'show'])
    router.on('/sign-in').renderInertia('sign_in')
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
    router.delete('/auth/sign-out', [AuthController, 'destroy'])
    router.get('/users/:id', [FeedController, 'show']) // TODO: Make public, and contextualize `ctx.auth.authenticate` via middleware.
    router.get('/users/:id/settings', [UsersController, 'show'])
    router.patch('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'delete'])
    router.post('/posts', [PostsController, 'create'])
    router.get('/posts/:id', [PostsController, 'show'])
    router.patch('/posts/:id', [PostsController, 'update'])
    router.delete('/posts/:id', [PostsController, 'destroy'])

    router.post('/posts/:id/react', [PostReactionsController, 'create'])
    router.delete('/posts/:id/react', [PostReactionsController, 'destroy'])

    router
      .group(() => {
        router.get(':id/report', [PostReportsController, 'show'])
        router.post(':id/report', [PostReportsController, 'create'])
        router.put(':id/report', [PostReportsController, 'update'])
        router.delete(':id/report', [PostReportsController, 'destroy'])
      })
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
        router.post('/sign-in', [AdminAuthController, 'show'])
        router.on('/sign-in').renderInertia('admin/sign_in')
      })
      .prefix('auth')

    /**
     * Admin protected
     */
    router
      .group(() => {
        router.delete('/auth/sign-out', [AdminAuthController, 'destroy'])
        router.on('/index').renderInertia('admin/index')

        router
          .group(() => {
            router.get('reports', [AdminPostReportsController, 'index'])
            router.put('reports/:id', [AdminPostReportsController, 'update'])
          })
          .prefix('posts')
      })
      .use(middleware.auth({ guards: ['admin-web'] }))
  })
  .prefix('admin')
