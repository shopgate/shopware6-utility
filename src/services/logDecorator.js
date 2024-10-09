'use strict'

const get = require('lodash.get')

/**
 * @param {string?} extensionName
 */
const logDecorator = (extensionName = '@apite-shopware6-helper') => {
  /**
   * @param {AxiosResponse|ClientApiError|ShopwareError|EntityError|Error} response
   * @return {SGConnectAPI.BasicErrorLog|SGConnectAPI.ClientApiErrorLog|FormattedAxiosResponse}
   */
  const decorateError = response => {
    if (response.statusText) {
      return {
        extension: extensionName,
        ...formatAxiosResponse(response)
      }
    } else if (response.statusCode || response.statusCode === 0) {
      return {
        extension: extensionName,
        errors: response.messages.map(err => ({
          ...err,
          meta: JSON.stringify(err.meta),
          trace: JSON.stringify(get(err, 'trace[0]') || {})
        }))
      }
    } else if (response.messageKey) {
      return {
        ...decorateMessage(response.message),
        messageKey: response.messageKey
      }
    }

    return {
      ...decorateMessage(response.message),
      ...response.stack ? { stack: _cleanMessage(response.stack) } : {}
    }
  }

  /**
   * @param {?string} message
   * @return {SGConnectAPI.BasicErrorLog}
   */
  const decorateMessage = message => ({
    extension: extensionName,
    message: _cleanMessage(message)
  })

  /**
   * @param {AxiosResponse} err
   * @returns {FormattedAxiosRequest & FormattedAxiosResponse}
   */
  const formatAxiosResponse = err => (
    {
      ...formatAxiosRequest(err.config),
      status: String(err.status),
      statusText: err.statusText,
      message: get(err, 'data.message') || '',
      errors: Object.entries(get(err, 'data.errors') || {}).map(([, item]) => item.message)
    }
  )

  /**
   * @param {AxiosRequestConfig} request
   * @returns {FormattedAxiosRequest}
   */
  const formatAxiosRequest = request => {
    return {
      call: request.method.toUpperCase() + ' ' + request.baseURL + request.url,
      headers: {
        ...request.headers['sw-context-token'] ? { 'sw-context-token': obfuscateString(request.headers['sw-context-token']) } : {},
        ...request.headers['sw-access-key'] ? { 'sw-access-key': obfuscateString(request.headers['sw-access-key']) } : {},
        'sw-language-id': request.headers['sw-language-id']
      },
      params: request.params
    }
  }

  /**
   * @param {?string} message
   * @return {?string}
   * @private
   */
  const _cleanMessage = (message) => {
    if (!message) {
      return undefined
    }
    // Remove newline characters
    let parsedQuery = message.replace(/\\n/g, '')
    // Remove extra spaces
    parsedQuery = parsedQuery.replace(/\s+/g, ' ').trim()

    return parsedQuery !== '' ? parsedQuery : undefined
  }

  /**
   * @param {?string} message
   * @return {string}
   */
  const obfuscateString = message => message ? '***' + message.slice(-7) : message

  return { decorateError, decorateMessage, formatAxiosResponse, formatAxiosRequest, obfuscateString }
}

module.exports = logDecorator
