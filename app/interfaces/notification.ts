import { BaseEntity } from '#interfaces/base_entity'
import { UserResponse } from '#interfaces/user'
import { DatabaseChannelData, DatabaseNotificationRow } from '@osenco/adonisjs-notifications/types'
import type { UUID } from 'node:crypto'

export interface NotificationRow extends Omit<DatabaseNotificationRow, 'id'> {
  id: UUID
}

export interface NotificationResponse extends BaseEntity {
  id: UUID
  data: NotificationResponseData
  readAt: string
}

export type NotificationResponseData = {
  user: UserResponse
  link: string
} & DatabaseChannelData
