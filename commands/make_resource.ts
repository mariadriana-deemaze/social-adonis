import { exec } from 'node:child_process'
import { args, BaseCommand } from '@adonisjs/core/ace'

export default class MakeResource extends BaseCommand {
  /**
   * Command Name is used to run the command
   */
  static commandName = 'make:resource'

  /**
   * Command Name is displayed in the "help" output
   */
  static description = 'Scaffold a project resource files'

  /**
   * Define the resource name parameter of the command
   */
  @args.string({
    argumentName: 'resource',
    description: 'Name of the resources files to be created',
  })
  declare resource: string

  async run() {
    const commands = [
      'make:migration',
      'make:model',
      'make:service',
      'make:controller',
      'make:factory',
    ]

    commands.forEach((command) => {
      exec(`node ace ${command} ${this.resource}`, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`error: ${error.message}`)
          return
        }
        if (stderr) {
          this.logger.error(`stderr: ${stderr}`)
          return
        }
        this.logger.info(stdout)
      })
    })
  }
}
