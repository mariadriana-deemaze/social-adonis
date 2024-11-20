import { BaseEntity } from '#interfaces/base_entity'
import { UserResponse } from '#interfaces/user'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { DatabaseChannelData, DatabaseNotificationRow } from '@osenco/adonisjs-notifications/types'
import type { UUID } from 'node:crypto'

export interface NotificationRow extends Omit<DatabaseNotificationRow, 'id'> {
  id: UUID
}

export interface NotificationData {
  user: ModelObject // Consider inclusion of user avatar
  title: string
  message: string
}

export interface NotificationResponse extends BaseEntity {
  id: UUID
  user: UserResponse
  data: DatabaseChannelData
  readAt: string
}
