const webpackConfig = require('./config/webpack')
const redirectsConfig = require('./config/redirects')

module.exports = {
  ...redirectsConfig,
  ...webpackConfig,
}
