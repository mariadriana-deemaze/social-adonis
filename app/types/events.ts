import Post from '#models/post'
import User from '#models/user'

declare module '@adonisjs/core/types' {
  interface EventsList {
    'auth:reset': { user: User; token: string }
    'post:mention': [string[], Post]
  }
}
