import emitter from '@adonisjs/core/services/emitter'

const TriggerPostMentionNotification = () => import('#listeners/trigger_post_mention_notification')

emitter.on('post:mention', [TriggerPostMentionNotification, 'handle'])
