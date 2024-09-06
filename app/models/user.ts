import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
// import { randomUUID } from 'crypto'
import type { UUID } from 'crypto'

export enum AccountRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})


export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: UUID // = randomUUID()

  @column()
  declare name: string | null

  @column()
  declare surname: string | null

  @column()
  declare email: string

  @column()
  role: AccountRole = AccountRole.USER

  @computed()
  get isAdmin() {
    return this.role === AccountRole.ADMIN
  }

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
