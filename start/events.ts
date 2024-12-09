import emitter from '@adonisjs/core/services/emitter'

const TriggerAuthResetNotification = () => import('#listeners/trigger_auth_reset_notification')
const TriggerPostMentionNotification = () => import('#listeners/trigger_post_mention_notification')

emitter.on('auth:reset', [TriggerAuthResetNotification, 'handle'])
emitter.on('post:mention', [TriggerPostMentionNotification, 'handle'])
