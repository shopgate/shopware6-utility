'use strict'

const { decorateError, decorateMessage } = require('./logDecorator')
/**
 * Select storage to use: device or user (if logged in)
 *
 * @param {ApiteSW6Helper.PipelineContext} context
 * @return ApiteSW6Helper.PipelineStorage
 * @private
 */
const _getStorage = context => context.meta.userId ? context.storage.user : context.storage.device

/**
 * @param {ApiteSW6Helper.PipelineContext} context
 * @return {Promise<string>}
 */
const getContextToken = async context => {
  return _getStorage(context).get('contextToken').then(contextToken => {
    // todo: remove
    context.log.debug('module: retrieved context:' + contextToken)
    return contextToken
  })
}

/**
 * Saves the current checkout token into internal storage (user or device)
 *
 * @param {string} contextToken
 * @param {ApiteSW6Helper.PipelineContext} context
 * @returns Promise<void>
 */
const saveContextToken = async function (contextToken, context) {
  await _getStorage(context).set('contextToken', contextToken)
    // todo: remove
    .then(() => context.log.fatal('module: saving context for: ' + contextToken))
    .catch(err => context.log.error(decorateError(err), 'Failed to save context token.'))
}

/**
 * @param {string} couponCode
 * @param {ApiteSW6Helper.PipelineContext} context
 * @return {Promise<void>}
 */
const saveCouponCode = async function (couponCode, context) {
  if (!context.config.cacheCoupon) {
    context.log.debug(decorateMessage('Coupon cache is disabled, skipping save'))
    return
  }
  await _getStorage(context).set('couponCode', couponCode).catch(err => {
    context.log.error(decorateError(err), 'Failed to save coupon code')
  })
}

/**
 * @param {ApiteSW6Helper.PipelineContext} context
 * @return {Promise<void>}
 */
const removeCouponCode = async function (context) {
  await _getStorage(context).del('couponCode').catch(err => {
    context.log.error(decorateError(err), 'Failed to remove coupon code')
  })
}

/**
 * @param {ApiteSW6Helper.PipelineContext} context
 * @return {Promise<string>}
 */
const getCouponCode = async context => _getStorage(context).get('couponCode')

module.exports = {
  getCouponCode,
  getContextToken,
  removeCouponCode,
  saveContextToken,
  saveCouponCode
}
