import { ModelObject } from '@adonisjs/lucid/types/model'

export interface NotificationData {
  user: ModelObject // Consider inclusion of user avatar
  title: string
  message: string
}
