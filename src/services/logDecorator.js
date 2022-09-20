'use strict'

/**
 * @param {string?} extensionName
 */
const logDecorator = (extensionName = '@apite-shopware6-helper') => {
  /**
   * @param {ApiteSW6Helper.SWClientApiError|ApiteSW6Helper.SWEntityError|ApiteSW6Helper.ShopwareError|Error} error
   * @return {ApiteSW6Helper.SWEntityError[]|ApiteSW6Helper.ShopwareError[]|string[]}
   */
  const extractErrorMessages = (error) => {
    if (error.statusCode) {
      // SWClientApiError
      return error.messages
    } else if (error.messageKey || error.status) {
      // SWEntityError | ShopwareError
      return [error]
    }
    // Error
    return [error.message]
  }

  /**
   * @param {ApiteSW6Helper.SWClientApiError|ApiteSW6Helper.SWEntityError|ApiteSW6Helper.ShopwareError|Error} error
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
   * @param {ApiteSW6Helper.SWClientApiError|ApiteSW6Helper.SWEntityError|ApiteSW6Helper.ShopwareError|Error} error
   * @return {{extension: string, code: (string|number), messages: (ApiteSW6Helper.SWEntityError[]|ApiteSW6Helper.ShopwareError[]|string[])}}
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
    messages: [message],
    stack: error.stack
  })

  return { decorateError, decorateMessage }
}

module.exports = logDecorator
