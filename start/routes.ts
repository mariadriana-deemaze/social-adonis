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
import AuthController from '#controllers/auth_controller'
import FeedController from '#controllers/feed_controller'
import PostsController from '#controllers/posts_controller'
import UsersController from '#controllers/users_controller'
import PostReactionsController from '#controllers/post_reactions_controller'
// import AdminUsersController from '#controllers/admin/admin_users_controller'

/**
 *
 * GUEST/PUBLIC
 *
 **/
router.on('/').renderInertia('home') // TODO: Contextualize `ctx.auth.authenticate` via middleware.

/**
 *
 * Auth
 *
 * */
router
  .group(() => {
    router.post('/sign-up', [AuthController, 'store'])
    router.on('/sign-up').renderInertia('sign-up')
    router.post('/sign-in', [AuthController, 'show'])
    router.on('/sign-in').renderInertia('sign-in')
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
    router.get('/feed', [FeedController, 'index'])
    router.get('/users/:id', [FeedController, 'show']) // TODO: Make public, and contextualize `ctx.auth.authenticate` via middleware.
    router.on('/users/:id/settings').renderInertia('users/settings')
    router.patch('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'delete'])
    router.post('/posts', [PostsController, 'create'])
    router.get('/posts/:id', [PostsController, 'show'])
    router.patch('/posts/:id', [PostsController, 'update'])
    router.delete('/posts/:id', [PostsController, 'destroy'])
    router.post('/posts/:id/react', [PostReactionsController, 'create'])
    router.delete('/posts/:id/react', [PostReactionsController, 'destroy'])
  })
  .use(middleware.auth())
