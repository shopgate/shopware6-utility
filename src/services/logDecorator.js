'use strict'

const get = require('lodash.get')

/**
 * @param {string?} extensionName
 */
const logDecorator = (extensionName = '@apite-shopware6-helper') => {
  /**
   * @param {ClientApiError|EntityError|ApiteSW6Utility.ShopwareError|Error} error
   * @return {EntityError[]|ApiteSW6Utility.ShopwareError[]|string[]}
   */
  // const extractErrorMessages = (error) => {
  //   if (error.statusCode) {
  //     // SWClientApiError
  //     return error.messages
  //   } else if (error.messageKey || error.status) {
  //     // SWEntityError | SWError
  //     return [error]
  //   }
  //   // Error
  //   return [error.message]
  // }
  //
  // /**
  //  * @param {ClientApiError|ApiteSW6Utility.SWEntityError|ApiteSW6Utility.SWError|Error} error
  //  * @return {string|number}
  //  */
  // const extractErrorCode = (error) => {
  //   if (error.statusCode) {
  //     return error.statusCode
  //   } else if (error.messageKey) {
  //     return error.code
  //   } else if (error.status) {
  //     return Number(error.status)
  //   }
  //   return 500
  // }

  /**
   * @param {AxiosResponse|Error} response
   * @return {{extension: string}|FormattedAxiosResponse}
   */
  const decorateError = response => {
    if (response.statusText) {
      return {
        extension: extensionName,
        ...formatAxiosResponse(response)
      }
    }

    return decorateMessage(response.message)
  }

  /**
   * @param {string} message
   * @return {{extension: string, messages: string[]}}
   */
  const decorateMessage = message => ({
    extension: extensionName,
    message
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
      errors: (get(err, 'data.errors') || []).map(item => _cleanMessage(item.detail))
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
        ...request.headers['sw-context-token'] ? { 'sw-context-token': '***' + request.headers['sw-context-token'].slice(-5) } : {},
        ...request.headers['sw-access-key'] ? { 'sw-access-key': '***' + request.headers['sw-access-key'].slice(-5) } : {},
        'sw-language-id': request.headers['sw-language-id']
      },
      params: request.params
    }
  }

  /**
   * @param {string} message
   * @return {string}
   * @private
   */
  const _cleanMessage = (message) => {
    // Remove newline characters
    let parsedQuery = message.replace(/\\n/g, '')
    // Remove extra spaces
    parsedQuery = parsedQuery.replace(/\s+/g, ' ').trim()

    // obfuscate sensitive data
    const sensitiveData = ['password']
    sensitiveData.forEach(key => {
      parsedQuery = parsedQuery.replace(new RegExp(`"${key}":\\s*"[^"]+"`, 'g'), `"${key}": "***"`)
    })

    return parsedQuery !== '' ? parsedQuery : undefined
  }

  return { decorateError, decorateMessage, formatAxiosResponse, formatAxiosRequest }
}

module.exports = logDecorator
