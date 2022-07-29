// https://console.spec.whatwg.org/#loglevel-severity
const CONSOLE_LEVELS = ['debug', 'log', 'info', 'warn', 'error']

// Notice that by default the levels will be ["error"]
const allowedConsoleLevels = CONSOLE_LEVELS.slice(
  CONSOLE_LEVELS.indexOf(process.env.CONSOLE_LEVEL)
)

global.console = CONSOLE_LEVELS.reduce((levels, level) => {
  return allowedConsoleLevels.includes(level)
    ? { ...levels, [level]: console[level] }
    : { ...levels, [level]: jest.fn() }
}, {})

// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-server-rendering-apis
// TODO: dummyRender.js needs to be updated to use the Suspense SSR Architectue instead of renderToStaticMarkup
const { TextEncoder } = require('util')
global.TextEncoder = TextEncoder
