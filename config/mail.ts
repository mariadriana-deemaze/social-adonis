import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: env.get('NODE_ENV') === 'production' ? 'ses' : 'smtp',

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {
    smtp: transports.smtp({
      host: env.get('LOCAL_SMTP_HOST'),
      port: env.get('LOCAL_SMTP_PORT'),
    }),
    ses: transports.ses({
      /**
       * Forwarded to aws sdk
       */
      apiVersion: '2010-12-01',
      region: 'eu-north-1',
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },

      /**
       * Nodemailer specific
       */
      sendingRate: 10,
      maxConnections: 5,
    }),
  },

  from: {
    address: env.get('FROM_MAIL'),
    name: 'Social Adonis',
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
