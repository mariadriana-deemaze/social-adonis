import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  google: services.google({
    clientId: env.get('GOOGLE_CLIENT_ID'),
    clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl:
      (env.get('NODE_ENV') === 'development'
        ? 'http://localhost:3000/'
        : env.get('PRODUCTION_URL')) + 'auth/google/callback/',
    prompt: 'select_account',
    hostedDomain:
      env.get('NODE_ENV') === 'development' ? 'http://localhost:3000/' : env.get('PRODUCTION_URL'),
    display: 'page',
    scopes: ['userinfo.email'],
  }),
  github: services.github({
    clientId: env.get('GITHUB_CLIENT_ID')!,
    clientSecret: env.get('GITHUB_CLIENT_SECRET')!,
    callbackUrl:
      (env.get('NODE_ENV') === 'development'
        ? 'http://localhost:3000/'
        : env.get('PRODUCTION_URL')) + 'auth/github/callback/',
    scopes: ['user'],
    allowSignup: true,
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}