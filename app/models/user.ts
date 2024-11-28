import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import Session from '#models/session'
import Post from '#models/post'
import Notifiable from '@osenco/adonisjs-notifications/mixins/notifiable'
import { randomUUID, type UUID } from 'node:crypto'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { NotificationChannelName } from '@osenco/adonisjs-notifications/types'

export enum AccountRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, Notifiable('user_notifications')) {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  username = `SOA_${randomUUID()}`

  @column()
  declare name: string | null

  @column()
  declare surname: string | null

  @column()
  declare email: string

  @column()
  declare verified: boolean

  @column()
  role: AccountRole = AccountRole.USER

  @computed()
  get fullName() {
    return ((this?.name || '') + ' ' + (this?.surname || '')).trim()
  }

  @computed({ serializeAs: null })
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

  // NOTE: Should be attached differently
  @computed()
  get notificationPreference(): NotificationChannelName | NotificationChannelName[] {
    return ['database', 'mail']
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
