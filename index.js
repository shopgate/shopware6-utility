const apiManager = require('./src/services/apiManager')
const clientManger = require('./src/services/clientManager')
const configManager = require('./src/services/configManager')
const connectApiManager = require('./src/services/connectApiManager')
const contextManager = require('./src/services/contextManager')
const errorList = require('./src/services/errorList')
const errorManager = require('./src/services/errorManager')
const logDecorator = require('./src/services/logDecorator')
const endpoints = require('./src/lib/endpoints')

const toExport = {
  apiManager,
  clientManger,
  configManager,
  connectApiManager,
  contextManager,
  errorList,
  errorManager,
  logDecorator,
  endpoints
}
module.exports = toExport

// Allow use of default import syntax in TypeScript
module.exports.default = toExport
