import { exec } from 'node:child_process'
import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeResource extends BaseCommand {
  static commandName = 'make:resource'
  static description = 'Scaffold a project resource files'

  @args.string({
    argumentName: 'resource',
    description: 'Name of the resources files to be created',
  })
  declare resource: string

  static options: CommandOptions = {}

  async run() {
    const commands = [
      `make:migration ${this.resource}`,
      `make:model ${this.resource}`,
      `make:service ${this.resource}`,
      `make:controller ${this.resource}`,
      `make:factory ${this.resource}`,
    ]

    commands.forEach((command) => {
      exec('node ace ' + command, (error, stdout, stderr) => {
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
