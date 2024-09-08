import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import type { UUID } from 'crypto'
import Session from '#models/session'
import Post from '#models/post'

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
  declare id: UUID

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

  @hasMany(() => Session)
  declare sessions: HasMany<typeof Session>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
