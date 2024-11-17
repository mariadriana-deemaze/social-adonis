import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/ace/types'
import logger from '@adonisjs/core/services/logger'

export default class TestingCommand extends BaseCommand {
  /**
   * Command Name is used to run the command
   */
  static commandName = 'lucid:query'

  /**
   * Command Name is displayed in the "help" output
   */
  static description = 'Consult the database data via direct queries with lucid'

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: true,
  }

  async run() {
    if (process.env.NODE_ENV === 'production') {
      logger.log('error', 'Only acessible via local development as a debug tool.')
      process.exit()
    }

    const command = await this.prompt.ask('Enter lucid query (e.g., User.all())')

    const isForbiddenCommand = new RegExp(/delete|update/).test(command)

    if (isForbiddenCommand) {
      logger.log('error', 'Forbidden command.')
      process.exit()
    }

    const [modelName, ...queryParts] = command.split('.')

    const queryMethod = queryParts.join('.')
    const modelNameSnakeCase = modelName.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()

    try {
      // @ts-ignore
      const model = await import(`#models/${modelNameSnakeCase}`)
        .then((module) => module.default)
        .catch(() => {
          throw new Error(`Model not found`)
        })

      const query = `model.${queryMethod}`

      try {
        // Dangerous choice, but I will take the risk in my local environment
        // eslint-disable-next-line no-eval
        const data = await eval(query)

        if (data) {
          const result = []

          for (const record of data) {
            result.push(record.toJSON())
          }

          this.printResult(data)
        } else {
          this.printResult(data)
        }
      } catch (error) {
        logger.log('error', `Error executing query: ${error.message}`)
      }
    } catch (error) {
      logger.log('error', `Unknown error: ${error.message}`)
    }

    process.exit()
  }

  private printResult(data: any): void {
    logger.log(
      'info',
      JSON.parse(
        JSON.stringify({
          data,
          count: data.length || 0,
        })
      )
    )
  }
}
