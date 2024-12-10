import User from '#models/user'
import AuthResetNotification from '#notifications/auth_reset_notification'

export default class TriggerAuthResetNotification {
  async handle({ user, token }: { user: User; token: string }) {
    user.notify(new AuthResetNotification(token))
  }
}
