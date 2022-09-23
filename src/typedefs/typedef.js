const {
  CartErrors,
  ClientApiError,
  ClientSettings,
  ErrorLevel,
  EntityError,
  LineItem,
  ShopwareError,
  SessionContext
} = require('@shopware-pwa/commons')
const { Cart, ShopwareApiInstance } = require('@shopware-pwa/shopware-6-client')

/**
 * @typedef ApiteSW6Utility
 */

/**
 * @typedef {Object} ApiteSW6Utility.UrlResponse
 * @property {string} url
 * @property {?string} expires - e.g 2022-09-23T14:43:30.000Z
 */

/**
 * @typedef {Object} ApiteSW6Utility.ContextToken
 * @property {string} contextToken - shopware context token (guest or customer)
 */

///
/// SW hacky pass-through
///
/** @typedef {EntityError} ApiteSW6Utility.SWEntityError */
/** @typedef {CartErrors} ApiteSW6Utility.SWCartErrors */
/** @typedef {ErrorLevel} ApiteSW6Utility.SWErrorLevel */
/** @typedef {ClientApiError} ApiteSW6Utility.SWClientApiError */
/** @typedef {ClientSettings} ApiteSW6Utility.SWClientSettings */
/** @typedef {ShopwareError} ApiteSW6Utility.SWError */
/** @typedef {Cart} ApiteSW6Utility.SWCart */
/** @typedef {LineItem} ApiteSW6Utility.SWLineItem */
/** @typedef {ShopwareApiInstance} ApiteSW6Utility.SWApiInstance */
/** @typedef {SessionContext} ApiteSW6Utility.SWContext */
