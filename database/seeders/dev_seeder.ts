import { UUID } from 'node:crypto'
import { PostCommentFactory } from '#database/factories/post_comment_factory'
import User, { AccountRole } from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker/locale/en_GB'
import PostComment from '#models/post_comment'
import { PostReactionFactory } from '#database/factories/post_reaction_factory'
import { PostFactory } from '#database/factories/post_factory'

export default class extends BaseSeeder {
  async run() {
    const users = await this.createUsers(10)

    for (const user of users) {
      const posts = await this.createUserPosts(user)

      for (const post of posts) {
        const rootComments = await this.createComments(
          post.id,
          users[this.maxInRange(users.length)].id
        )

        await Promise.all([
          this.createNestedComments(
            post.id,
            users[this.maxInRange(users.length)].id,
            rootComments[this.maxInRange(rootComments.length)]
          ),
          this.createPostReactions(
            post.id,
            this.getRandomElements(
              users.map((u) => u.id),
              this.maxInRange(5)
            )
          ),
        ])
      }
    }
  }

  private async createUsers(amount: number = 10) {
    const users = [...Array(amount - 1)].map(() => {
      return {
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'user_password',
      }
    })

    const admin = {
      name: 'Admin',
      surname: 'User',
      email: 'admin_user@gmail.com',
      password: 'take1WildGuess!',
      role: AccountRole.ADMIN,
    }

    return User.createMany([...users, admin])
  }

  private async createUserPosts(user: User, amount: number = 5) {
    return PostFactory.merge({ userId: user.id }).createMany(amount)
  }

  private async createComments(postId: UUID, userId: UUID, amount: number = 5) {
    return PostCommentFactory.merge({ postId, userId }).createMany(amount)
  }

  private async createNestedComments(
    postId: UUID,
    userId: UUID,
    parentPostComment: PostComment,
    amount: number = 3
  ) {
    return PostCommentFactory.merge({
      postId,
      userId,
      parentId: parentPostComment.id,
    }).createMany(amount)
  }

  private async createPostReactions(postId: UUID, usersId: UUID[]) {
    usersId.forEach(async (userId) => await PostReactionFactory.merge({ userId, postId }).create())
  }

  private maxInRange(max: number) {
    return Math.floor(Math.random() * max)
  }

  private getRandomElements<T>(array: T[], numElements: number): T[] {
    if (numElements > array.length) {
      throw new Error('numElements must be less than or equal to the array length')
    }

    const result: T[] = []
    const usedIndices = new Set<number>()

    while (result.length < numElements) {
      const randomIndex = Math.floor(Math.random() * array.length)

      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex)
        result.push(array[randomIndex])
      }
    }

    return result
  }
}
