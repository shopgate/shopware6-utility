'use strict'

/**
 * @param {string?} extensionName
 */
const logDecorator = (extensionName = '@apite-shopware6-helper') => {
  /**
   * @param {ApiteSW6Utility.SWClientApiError|ApiteSW6Utility.SWEntityError|ApiteSW6Utility.SWError|Error} error
   * @return {ApiteSW6Utility.SWEntityError[]|ApiteSW6Utility.SWError[]|string[]}
   */
  const extractErrorMessages = (error) => {
    if (error.statusCode) {
      // SWClientApiError
      return error.messages
    } else if (error.messageKey || error.status) {
      // SWEntityError | SWError
      return [error]
    }
    // Error
    return [error.message]
  }

  /**
   * @param {ApiteSW6Utility.SWClientApiError|ApiteSW6Utility.SWEntityError|ApiteSW6Utility.SWError|Error} error
   * @return {string|number}
   */
  const extractErrorCode = (error) => {
    if (error.statusCode) {
      return error.statusCode
    } else if (error.messageKey) {
      return error.code
    } else if (error.status) {
      return Number(error.status)
    }
    return 500
  }

  /**
   * @param {ApiteSW6Utility.SWClientApiError|ApiteSW6Utility.SWEntityError|ApiteSW6Utility.SWError|Error} error
   * @return {{extension: string, code: (string|number), messages: (ApiteSW6Utility.SWEntityError[]|ApiteSW6Utility.SWError[]|string[])}}
   */
  const decorateError = (error) => ({
    extension: extensionName,
    code: extractErrorCode(error),
    messages: extractErrorMessages(error)
  })

  /**
   * @param {string} message
   * @param {number} code - arbitrary code to search by
   * @return {{extension: string, messages: string[]}}
   */
  const decorateMessage = (message, code = 15) => ({
    extension: extensionName,
    code,
    messages: [message]
  })

  return { decorateError, decorateMessage }
}

module.exports = logDecorator
