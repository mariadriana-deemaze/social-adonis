import Post from '#models/post'
import PostReport from '#models/post_report'
import User, { AccountRole } from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PostReportPolicy extends BasePolicy {
 /**
 * Every user can create a post report, unless if the post is their own.
 */
 create(user: User, post: Post): AuthorizerResponse {
  return user.id !== post.userId
 }

 /**
  * Only the reporting user or an administrative user, can edit the post report.
  */
 edit(user: User, post: PostReport): AuthorizerResponse {
  return user.role === AccountRole.ADMIN || user.id === post.userId
 }

 /**
  * Only the reporting user can delete the report.
  */
 delete(user: User, report: PostReport): AuthorizerResponse {
  return user.id === report.userId
 }
}
