import { args, BaseCommand } from '@adonisjs/core/ace'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export default class MakePage extends BaseCommand {
  /**
   * Command Name is used to run the command
   */
  static commandName = 'make:page'

  /**
   * Command Description is displayed in the "help" output
   */
  static description = 'Create a new React page component'

  /**
   * Define the path parameter for the command
   */
  @args.string({ description: 'Path to the page component (e.g., admin/reports/show)' })
  filePath: string = ''

  /**
   * Path where the generated inertia files will be created
   */
  private basePath = 'inertia/pages'

  /**
   * Run method to generate the component
   */
  async run() {
    try {
      const resolvedPath = path.join(this.basePath, this.filePath)
      const dirPath = path.dirname(resolvedPath)
      const fileName = path.basename(resolvedPath)
      const componentActionName = this.capitalize(fileName)
      await fs.mkdir(dirPath, { recursive: true })
      const fileContent = this.getComponentTemplate(componentActionName, this.filePath)
      const filePathWithExtension = `${resolvedPath}.tsx`
      await fs.writeFile(filePathWithExtension, fileContent)

      this.logger.success(`Page created: ${filePathWithExtension}`)
    } catch (error) {
      this.logger.error(`Failed to create page: ${error.message}`)
    }
  }

  /**
   * Capitalize the first letter of a string
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  /**
   * Create the default React component template
   */
  private getComponentTemplate(action: string, filePath: string): string {
    return `export default function ${action}() {
  return (
      <div>
        <h1>${filePath} Page</h1>
      </div>
  );
}`
  }
}
