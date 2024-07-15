/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import { middleware } from '#start/kernel'

router.on('/').renderInertia('home', { version: 6 })

router
  .group(() => {
    router.post('/sign-up', [AuthController, 'store'])
    router.on('/sign-up').renderInertia('sign-up')
    router.post('/sign-in', [AuthController, 'show'])
    router.on('/sign-in').renderInertia('sign-in')
  })
  .prefix('auth')

router
  .group(() => {
    router.on('/posts').renderInertia('posts')
  })
  .use(middleware.auth())
