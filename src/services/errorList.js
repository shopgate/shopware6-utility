'use strict'

class CartError extends Error {
  constructor (message = 'message-default', code = 'EUNKNOWN', entityId = '') {
    super()
    this.message = 'Error'
    this.code = 'ECART'
    /**
     * @type {ApiteSW6Cart.SGCartError[]}
     */
    this.errors = [{ entityId, code, message: `ApiteSW6Utility.notice.${message}`, translated: false }]
  }

  /**
   * @param {EntityError} error
   * @param {string} code - Shopgate Error code, e.g. EUNKNOWN
   * @return {CartError}
   */
  mapEntityError (error, code = 'ESWERROR') {
    this.errors = [{
      entityId: error.id,
      code,
      message: 'ApiteSW6Utility.notice.' + error.messageKey,
      messageParams: { ...error },
      translated: false
    }]
    return this
  }
}

class ProductNotFoundError extends CartError {
  constructor (entityId = '') {
    super('product-not-found', 'ENOTFOUND', entityId)
  }
}

class ProductStockReachedError extends CartError {}

class PurchaseStepsError extends CartError {}

class PromoAddedError extends CartError {}

class PromoNotFoundError extends CartError {}

class PromoNotEligibleError extends CartError {}

class AutoPromoNotEligibleError extends CartError {}

class TranslatableError extends Error {
  constructor (message, code, params = {}) {
    super()
    this.message = message
    this.code = code
    this.params = params
  }
}

class ThrottledError extends TranslatableError {
  constructor () { super('ApiteSW6Utility.notice.rateLimitExceeded', 'EREQUESTTHROTTLED') }
}

class InvalidCredentialsError extends TranslatableError {
  constructor () { super('ApiteSW6Utility.notice.loginBadCredentials', 'EBADCREDENTIALS') }
}

class InactiveAccountError extends TranslatableError {
  constructor () { super('ApiteSW6Utility.notice.inactiveAccountAlert', 'EINACTIVEACCOUNT') }
}

/**
 * Code handled by theme, guest trying to call customer pipelines
 */
class UnauthorizedError extends TranslatableError {
  constructor () { super('', 'EACCESS') }
}

class UnknownError extends TranslatableError {
  constructor () { super('ApiteSW6Utility.notice.message-default', 'EUNKNOWN') }
}

/**
 * A state of the app that requires the current App user to be logged out.
 * Our frontend subscriber handles this error. Cart ext also has a similar
 * catcher, so it's possible this error may not be fired.
 */
class ContextDeSyncError extends TranslatableError {
  constructor () { super('ApiteSW6Utility.app.not-in-sync', 'EDESYNC') }
}

module.exports = {
  AutoPromoNotEligibleError,
  CartError,
  ContextDeSyncError,
  InactiveAccountError,
  InvalidCredentialsError,
  PurchaseStepsError,
  PromoAddedError,
  PromoNotEligibleError,
  PromoNotFoundError,
  ProductNotFoundError,
  ProductStockReachedError,
  ThrottledError,
  UnauthorizedError,
  UnknownError
}
