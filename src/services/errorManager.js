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
const { decorateError } = require('./logDecorator')()

/**
 * @param {ApiteSW6Helper.SWErrorLevel} shopwareType
 */
const toShopgateType = function (shopwareType) {
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
 * @param {ApiteSW6Helper.SWEntityError} error
 * @return SGCartMessage
 */
const toShopgateMessage = function (error) {
  return {
    type: toShopgateType(error.level),
    code: error.messageKey,
    message: error.message,
    messageParams: {},
    translated: true
  }
}

/**
 * Note that this only throws if errors are present
 *
 * @param {ApiteSW6Helper.SWCartErrors} errorList
 * @param {ApiteSW6Helper.PipelineContext} context
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
          // this is not a hard error, products are still added/updated
          break
        default:
          context.log.error(decorateError(errorList[key]), 'Cannot map error')
          throw new UnknownError()
      }
    })
}

/**
 * Sometimes we want to throw even on information messages
 * to show customer information via Error modal
 *
 * @param {ApiteSW6Helper.SWCartErrors} errorList
 * @param {ApiteSW6Helper.PipelineContext} context
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
 * @param {ApiteSW6Helper.ShopwareError[]} messages
 * @param {ApiteSW6Helper.PipelineContext} context
 * @throws Error
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
 * @param {ApiteSW6Helper.SWClientApiError|Error} error
 * @param {ApiteSW6Helper.PipelineContext} context
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
 * @param {ApiteSW6Helper.ClientApiError} error
 */
const standardizeErrorMessages = (error) => {
  error.messages.forEach(message => {
    if (message.code === '0' && message.status === '401') {
      error.statusCode = 400
      message.code = 'CHECKOUT__CUSTOMER_AUTH_BAD_CREDENTIALS'
    }
    return message
  })
}

module.exports = {
  throwOnApiError,
  throwOnCartErrors,
  throwOnCartInfoErrors,
  toShopgateType,
  toShopgateMessage
}
