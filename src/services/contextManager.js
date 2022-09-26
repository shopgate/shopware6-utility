'use strict'

const { decorateError, decorateMessage } = require('./logDecorator')
/**
 * Select storage to use: device or user (if logged in)
 *
 * @param {ApiteSW6Utility.PipelineContext} context
 * @return ApiteSW6Utility.PipelineStorage
 * @private
 */
const _getStorage = context => context.meta.userId ? context.storage.user : context.storage.device

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @return {Promise<string>}
 */
const getContextToken = async context => _getStorage(context).get('contextToken')

/**
 * Saves the current checkout token into internal storage (user or device)
 *
 * @param {string} contextToken
 * @param {ApiteSW6Utility.PipelineContext} context
 * @returns Promise<void>
 */
const saveContextToken = async (contextToken, context) =>
  _getStorage(context).set('contextToken', contextToken).catch(err =>
    context.log.error(decorateError(err), 'Failed to save context token.')
  )

/**
 * @param {string} couponCode
 * @param {ApiteSW6Utility.PipelineContext} context
 * @return {Promise<void>}
 */
const saveCouponCode = async (couponCode, context) => {
  if (!context.config.cacheCoupon) {
    context.log.debug(decorateMessage('Coupon cache is disabled, skipping save'))
    return
  }
  return _getStorage(context).set('couponCode', couponCode).catch(err => {
    context.log.error(decorateError(err), 'Failed to save coupon code')
  })
}

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @return {Promise<void>}
 */
const removeCouponCode = async context =>
  _getStorage(context).del('couponCode').catch(err =>
    context.log.error(decorateError(err), 'Failed to remove coupon code')
  )

/**
 * @param {ApiteSW6Utility.PipelineContext} context
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
