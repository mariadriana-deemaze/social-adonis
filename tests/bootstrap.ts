import { assert } from '@japa/assert'
import app from '@adonisjs/core/services/app'
import { authBrowserClient } from '@adonisjs/auth/plugins/browser_client'
import { sessionBrowserClient } from '@adonisjs/session/plugins/browser_client'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { browserClient } from '@japa/browser-client'
import testUtils from '@adonisjs/core/services/test_utils'
import { izzyRoutePlugin } from '@izzyjs/route/plugins/japa'
import type { Config } from '@japa/runner/types'

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = [
  assert(),
  browserClient({
    runInSuites: ['browser'],
  }),
  authBrowserClient(app),
  sessionBrowserClient(app),
  pluginAdonisJS(app),
  izzyRoutePlugin()
]

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executer after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [() => testUtils.db().truncate()],
  teardown: [],
}

/**
 * Test reporters are used to collect test progress and display a summary after the tests have been executed.
 * A test reporter can choose the format and the destination where it wants to display the progress and the summary.
 */
export const reporters: Config['reporters'] = {
  activated: ['spec'],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
