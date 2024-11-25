import app from '@adonisjs/core/services/app'
import repl from '@adonisjs/core/services/repl'
import { fsImportAll } from '@adonisjs/core/helpers'

repl.addMethod(
  'loadModels',
  async () => {
    const models = await fsImportAll(app.makePath('app/models'))
    repl.server!.context.models = models
    repl.notify('Imported models. You can access them using the "models" property')
    repl.server!.displayPrompt()
  },
  {
    description: 'Load all application models in the REPL context',
    usage: `loadModels`,
  }
)
