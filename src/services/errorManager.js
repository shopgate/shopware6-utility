'use strict'

const _get = require('lodash.get')
const {
  AutoPromoNotEligibleError,
  InvalidCredentialsError,
  InactiveAccountError,
  ProductNotFoundError,
  ProductStockReachedError,
  PromoAddedError,
  PromoNotEligibleError,
  PromoNotFoundError,
  ThrottledError,
  UnknownError
} = require('./errorList')
const { decorateError, formatAxiosResponse } = require('./logDecorator')()

/**
 * @param {ErrorLevel} shopwareType
 */
const toShopgateType = shopwareType => {
  switch (shopwareType) {
    case 20:
      return 'error'
    case 10:
      return 'warning'
    case 0:
    default:
      return 'info'
  }
}

/**
 * @param {EntityError} error
 * @return {ApiteSW6Cart.SGCartMessage}
 */
const toShopgateMessage = (error) => ({
  type: toShopgateType(error.level),
  code: error.messageKey,
  message: error.message,
  messageParams: {},
  translated: true
})

/**
 * Note that this only throws if errors are present
 *
 * @param {CartErrors} errorList
 * @param {ApiteSW6Utility.PipelineContext} context
 * @throws {Error}
 */
const throwOnCartErrors = function (errorList, context) {
  Object.keys(errorList)
    .filter(key => errorList[key].level > 0)
    .forEach((key) => {
      context.log.info(decorateError(errorList[key]))
      switch (errorList[key].messageKey) {
        case 'product-not-found':
        case 'product-invalid':
          throw (new ProductNotFoundError().mapEntityError(errorList[key], 'ENOTFOUND'))
        case 'promotion-not-found':
          throw (new PromoNotFoundError().mapEntityError(errorList[key], 'EINVALIDCOUPON'))
        case 'auto-promotion-not-found':
          throw (new AutoPromoNotEligibleError().mapEntityError(errorList[key], 'ENOTELIGIBLE'))
        case 'product-stock-reached':
        case 'purchase-steps-quantity':
          throw (new ProductStockReachedError().mapEntityError(errorList[key], 'ESTOCKREACHED'))
        case 'shipping-method-blocked':
        case 'shipping-address-blocked':
        case 'payment-method-blocked':
          // this is not a hard error, products are still added/updated
          break
        default:
          context.log.error(decorateError(errorList[key]), 'rest-unmapped-error')
          throw new UnknownError()
      }
    })
}

/**
 * Sometimes we want to throw even on information messages
 * to show customer information via Error modal
 *
 * @param {CartErrors} errorList
 * @param {ApiteSW6Utility.PipelineContext} context
 * @throws {Error}
 */
const throwOnCartInfoErrors = function (errorList, context) {
  Object.keys(errorList)
    .filter(key => errorList[key].level === 0)
    .forEach((key) => {
      context.log.info(decorateError(errorList[key]))
      switch (errorList[key].messageKey) {
        case 'promotion-not-eligible':
        case 'promotion-excluded':
          throw (new PromoNotEligibleError().mapEntityError(errorList[key], 'ENOTELIGIBLE'))
        case 'promotion-discount-added':
          throw (new PromoAddedError().mapEntityError(errorList[key], 'EPROMOADDED'))
      }
    })
  throwOnCartErrors(errorList, context)
}

/**
 * @param {ShopwareError[]} messages
 * @param {ApiteSW6Utility.PipelineContext} context
 * @throws {Error}
 */
const throwOnMessage = function (messages, context) {
  messages.forEach(message => {
    switch (message.code) {
      case 'CHECKOUT__CART_LINEITEM_NOT_FOUND':
        context.log.info(decorateError(message), 'Could not locate line item in cart')
        throw new ProductNotFoundError(_get(message, 'meta.parameters.identifier', ''))
      case 'FRAMEWORK__INVALID_UUID':
        context.log.fatal(decorateError(message), 'Unexpected UID provided')
        throw new UnknownError()
      case 'FRAMEWORK__MISSING_REQUEST_PARAMETER':
        context.log.error(decorateError(message), 'Silenced error')
        // it's soft only in one case where it's a registerUrl pipeline, otherwise we need to keep track of this
        break
      case 'CHECKOUT__CUSTOMER_NOT_LOGGED_IN':
        context.log.debug(decorateError(message), 'Logged in SG, but contextToken is of a guest.')
        // a soft error when trying to log out a customer that is already using a guest token
        break
      case 'CHECKOUT__CUSTOMER_AUTH_BAD_CREDENTIALS':
        context.log.error(decorateError(message), 'Unauthorized request, is user/password correct?')
        throw new InvalidCredentialsError()
      case 'CHECKOUT__CUSTOMER_IS_INACTIVE':
        context.log.error(decorateError(message), 'Customer is not active. Needs to confirm account in email.')
        throw new InactiveAccountError()
      case 'CHECKOUT__DUPLICATE_WISHLIST_PRODUCT':
        context.log.info(decorateError(message), 'Duplicate product found when merging wishlist')
        break
      default:
        context.log.error(decorateError(message), 'Unmapped error')
        throw new UnknownError()
    }
  })
}

/**
 * @param {ClientApiError|Error} error
 * @param {ApiteSW6Utility.PipelineContext} context
 * @see https://shopware.stoplight.io/docs/store-api/ZG9jOjExMTYzMDU0-error-handling
 * @throws {Error}
 */
const throwOnApiError = function (error, context) {
  if (!error.statusCode || !error.messages || (error.messages && error.messages.length === 0)) {
    context.log.error(decorateError(error), 'Not a Shopware API error thrown')
    throw new UnknownError()
  }
  standardizeErrorMessages(error)
  switch (error.statusCode) {
    case 400:
      throwOnMessage(error.messages, context)
      break
    case 401:
      context.log.fatal(decorateError(error), 'Unauthorized request, is your SalesChannel access token missing?')
      throw new UnknownError()
    case 403:
      context.log.fatal(decorateError(error), 'No authentication or wishlist is not activated in Shopware')
      throw new UnknownError()
    case 404:
      context.log.warn(decorateError(error), 'Product does not exists, de-sync between cached catalog & Shopware')
      break
    case 412:
      context.log.fatal(decorateError(error), 'Possibly SalesChannel access key is invalid.')
      throw new UnknownError()
    case 429:
      context.log.fatal(decorateError(error), 'Too many API requests. SW rate limiter is blocking calls.')
      throw new ThrottledError()
    case 500:
    default:
      throwOnMessage(error.messages, context)
  }
}

/**
 * Helps fix inconsistent SW API returned messages
 *
 * @param {ClientApiError} error
 */
const standardizeErrorMessages = (error) => {
  error.messages.forEach(message => {
    if (message.code === '0' && message.status === '401') {
      error.statusCode = 400
      message.code = 'CHECKOUT__CUSTOMER_AUTH_BAD_CREDENTIALS'
    } else if (message.status === '404' && message.detail.startsWith('No route found')) {
      error.statusCode = 500
    }
    return message
  })
}

/**
 * Handle all HTTP status codes from 4xx group as an API errors, including 500 (exception for order placement issue)
 * 408 timeout error is handled separately
 * @param {number} statusCode
 * @returns {boolean}
 */
const isApiError = statusCode => {
  return (statusCode !== 408 && statusCode.toString().startsWith('4')) ||
    statusCode === 500
}

/**
 * @param {ShopwareApiError} error
 * @return {number}
 */
const extractApiErrorStatusCode = error => {
  return (
    _get(error, 'response.status') || guessTheStatusCodeFromTheMessage(error.message)
  )
}

/**
 * Sometimes the HTTP status code is not available and must be guessed from the message.
 * In cases like connection problems, or timeout error comes from intermediate layer (i.e. client)
 * @param {string} message
 * @return {number}
 */
const guessTheStatusCodeFromTheMessage = message => {
  // catch the specific timeout rejection from axios
  if (typeof message === 'string' && message.startsWith('timeout of')) {
    return 408
  }

  // offline mode exception
  if (typeof message === 'string' && message.startsWith('Network Error')) {
    return 0
  }

  // connection refused error
  if (typeof message === 'string' && message.startsWith('connect')) {
    return 0
  }

  return 500
}

/**
 * Extract error message
 * Keep the original errors[] format if 400 Bad Request for validation purposes.
 * 400 responses always points to the specific field/param/option, thus should be kept entirely.
 *
 * @param {ShopwareApiError} error
 * @returns {(string|ShopwareError[])} single message if statusCode !== 400, array of native errors otherwise
 */
const extractApiErrorMessage = error => {
  return _get(error, 'response.data.errors') || []
}

/**
 * Extract message from AxiosError which comes from somewhere else.
 * @param {AxiosError} error
 * @returns {ShopwareError[]}
 */
const extractNonApiErrorMessage = error =>
  [
    {
      detail: error.message,
      status: '',
      code: '',
      title: '',
      meta: {},
      source: {}
    }
  ]

/**
 * Extracts and create the consistent error object
 * Error message depends on:
 * 1. type of error (API or other network layer)
 * 2. status code
 *
 * @param {ShopwareApiError} error
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns {Promise<ClientApiError>}
 */
const errorInterceptor = async (error, context) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  const statusCode = extractApiErrorStatusCode(error)
  const clientApiError = {
    messages: isApiError(statusCode)
      ? extractApiErrorMessage(error)
      : extractNonApiErrorMessage(error),
    statusCode: statusCode
  }
  if (error.response) {
    context.log.error(formatAxiosResponse(error.response), 'rest-error-catch-all')
  } else {
    context.log.error({ message: error.message }, 'rest-non-api-error')
  }
  return Promise.reject(clientApiError)
}

module.exports = {
  errorInterceptor,
  throwOnApiError,
  throwOnCartErrors,
  throwOnCartInfoErrors,
  throwOnMessage,
  toShopgateType,
  toShopgateMessage
}
