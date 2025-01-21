import User from '#models/user'
import PostComment from '#models/post_comment'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PostCommentPolicy extends BasePolicy {
  /**
   * Every user can create a `PostComment`.
   */
  store(user: User): AuthorizerResponse {
    return !!user
  }

  /**
   * Only the commenting user, and the Admin, can update the `PostComment`.
   */
  update(user: User, postComment: PostComment): AuthorizerResponse {
    return user.id === postComment.userId
  }

  /**
   * Only the commenting user, and the Admin, can destroy the `PostComment`.
   */
  destroy(user: User, postComment: PostComment): AuthorizerResponse {
    return user.id === postComment.userId || user.isAdmin
  }
}
