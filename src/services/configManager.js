'use strict'

const { decorateMessage } = require('./logDecorator')
const { UnknownError } = require('./errorList')

/**
 * @param {any} property
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {void}
 * @throws {UnknownError}
 */
const validate = (property, context) => {
  if (!property) {
    context.log.fatal(decorateMessage('A required value in the config was not set (e.g. endpoint, accessToken, etc'))
    throw new UnknownError()
  }
}

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {string|undefined}
 */
const getEndpoint = context => {
  const endpoint = process.env.SW_ENDPOINT || context.config.endpoint

  return validate(endpoint, context) || endpoint
}

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {string|undefined}
 */
const getAccessToken = context => {
  const accessToken = process.env.SW_ACCESS_KEY || context.config.accessToken

  return validate(accessToken, context) || accessToken
}

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {string|undefined}
 */
const getLanguageId = context => process.env.SW_LANG_ID || context.config.languageId

module.exports = { getAccessToken, getEndpoint, getLanguageId }
