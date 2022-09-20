const apiManager = require('./src/services/apiManager')
const configManager = require('./src/services/configManager')
const connectApiManager = require('./src/services/connectApiManager')
const contextManager = require('./src/services/contextManager')
const errorList = require('./src/services/errorList')
const logDecorator = require('./src/services/logDecorator')

const toExport = {
  apiManager,
  configManager,
  connectApiManager,
  contextManager,
  errorList,
  logDecorator
}
module.exports = toExport

// Allow use of default import syntax in TypeScript
module.exports.default = toExport
