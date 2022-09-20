const {
  CartErrors,
  ClientApiError,
  ErrorLevel,
  EntityError,
  LineItem,
  ShopwareError
} = require('@shopware-pwa/commons')
const { Cart, ShopwareApiInstance } = require('@shopware-pwa/shopware-6-client')

///
/// SW hacky pass-through
///
/** @typedef {EntityError} ApiteSW6Helper.SWEntityError */
/** @typedef {CartErrors} ApiteSW6Helper.SWCartErrors */
/** @typedef {ErrorLevel} ApiteSW6Helper.SWErrorLevel */
/** @typedef {ClientApiError} ApiteSW6Helper.SWClientApiError */
/** @typedef {ShopwareError} ApiteSW6Helper.ShopwareError */
/** @typedef {Cart} ApiteSW6Helper.SWCart */
/** @typedef {LineItem} ApiteSW6Helper.SWLineItem */
/** @typedef {ShopwareApiInstance} ApiteSW6Helper.SWApiInstance */
