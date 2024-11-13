import Post from '#models/post';
import PostReport from '#models/post_report';
import type { HttpContext } from '@adonisjs/core/http'

export default class PostReportsController {

 async create(ctx: HttpContext) {
  const currentUser = ctx.auth.user?.id!
  const postId = ctx.request.qs().id;
  const post = await Post.findByOrFail(postId);

  const payload = await ctx.request.body()

  if (await ctx.bouncer.with('PostReportPolicy').denies('create', post)) {
   return ctx.response.forbidden('You cannot report your own post.')
  }

  /* 
    const data = 
  
    PostReport.create({
     reason
    })
   */
 }

 async update(ctx: HttpContext) {
  //
 }

 async destroy(ctx: HttpContext) {
  //
 }
}
