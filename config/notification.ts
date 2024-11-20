import { channels, defineConfig } from '@osenco/adonisjs-notifications'

const notificationConfig = defineConfig({
  channels: {
    database: channels.database({}),
    mail: channels.mail({}),
  },
})

export default notificationConfig

declare module '@osenco/adonisjs-notifications/types' {
  interface NotificationChannels extends InferChannels<typeof notificationConfig> {}
  // Use this to type the database notification data
  interface DatabaseChannelData {}
}
