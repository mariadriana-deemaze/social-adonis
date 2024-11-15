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
    router.on('/').renderInertia('home').as('home.show')
    router.get('/feed', [FeedController, 'index']).as('feed.show')
  })
  .use(middleware.guest())

/**
 *
 * Auth
 *
 * */
router
  .group(() => {
    router.post('/sign-up', [AuthController, 'store']).as('auth.store')
    router.on('/sign-up').renderInertia('sign_up')
    router.post('/sign-in', [AuthController, 'show']).as('auth.show')
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
    router.delete('/auth/sign-out', [AuthController, 'destroy']).as('auth.destroy')
    router.get('/users/:id', [FeedController, 'show']).as('users.show') // TODO: Make public, and contextualize `ctx.auth.authenticate` via middleware.
    router.get('/users/:id/settings', [UsersController, 'show']).as('settings.show')
    router.patch('/users/:id', [UsersController, 'update']).as('users.update')
    router.delete('/users/:id', [UsersController, 'delete']).as('users.destroy') // delete vs destroy
    router.post('/posts', [PostsController, 'create']).as('posts.store') // create vs store
    router.get('/posts/:id', [PostsController, 'show']).as('posts.show')
    router.patch('/posts/:id', [PostsController, 'update']).as('posts.update')
    router.delete('/posts/:id', [PostsController, 'destroy']).as('posts.destroy')

    router.post('/posts/:id/react', [PostReactionsController, 'create']).as('posts_reactions.store')
    router.delete('/posts/:id/react', [PostReactionsController, 'destroy']).as('posts_reactions.destroy')

    router
      .group(() => {
        router.get(':id/report', [PostReportsController, 'show']).as('posts_reports.show')
        router.post(':id/report', [PostReportsController, 'create']).as('posts_reports.store') // create vs store
        router.put(':id/report', [PostReportsController, 'update']).as('posts_reports.update')
        router.delete(':id/report', [PostReportsController, 'destroy']).as('posts_reports.destroy')
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
