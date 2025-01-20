/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  PostCommentPolicy: () => import('#policies/post_comment_policy'),
  PostPolicy: () => import('#policies/posts_policy'),
  PostReportPolicy: () => import('#policies/post_report_policy'),
}
