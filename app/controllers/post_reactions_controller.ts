import PostReactionService from '#services/post_reaction_service';
import { errorsReducer } from '#utils/index';
import { postReactionValidator } from '#validators/post';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine';

@inject()
export default class PostReactionsController {

  constructor(
    private readonly service: PostReactionService
  ) { }

  async create(ctx: HttpContext) {
    const postId = ctx.params.id;
    const userId = ctx.auth.user?.id!;
    const payload = ctx.request.body();
    try {
      const { reaction } = await postReactionValidator.validate(payload)
      const [preExistant, resource] = await this.service.create(userId, postId, reaction);
      return preExistant ? ctx.response.ok(resource) : ctx.response.created(resource);
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        return ctx.response.badRequest(reducedErrors);
      }
      return ctx.response.badRequest();
    }
  }

  async destroy(ctx: HttpContext) {
    const postId = ctx.params.id;
    const userId = ctx.auth.user?.id!;
    await this.service.destroy(userId, postId);
    return ctx.response.noContent()
  }
}
