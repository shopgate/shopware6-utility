'use strict'

/**
 * @public
 */
const getCategoryEndpoint = () => '/store-api/category'

/**
 * @public
 */
const getCategoryDetailsEndpoint = (categoryId) =>
  `/store-api/category/${categoryId}`

// product-listing

/**
 * @public
 */
const getProductListingEndpoint = (categoryId) =>
  `/store-api/product-listing/${categoryId}`

// product

/**
 * @public
 */
const getProductEndpoint = () => '/store-api/product'

/**
 * @public
 */
const getProductDetailsEndpoint = productId =>
  `/store-api/product/${productId}`

// customer

/**
 * @public
 */
const getCustomerEndpoint = () => '/store-api/account/customer'

/**
 * @public
 */
const getCustomerLoginEndpoint = () => '/store-api/account/login'

/**
 * @public
 */
const getCustomerLogoutEndpoint = () => '/store-api/account/logout'

/**
 * @public
 */
const getCustomerUpdatePaymentMethodEndpoint = (
  paymentMethodId
) => `/account/change-payment-method/${paymentMethodId}`

// checkout

/**
 * @public
 */
const getCheckoutCartEndpoint = () => '/store-api/checkout/cart'

/**
 * @public
 */
const getCheckoutCartLineItemEndpoint = () =>
  '/store-api/checkout/cart/line-item'

/**
 * @public
 */
const getRemoveCartLineItemEndpoint = () => '/store-api/checkout/cart/line-item/delete'

/**
 * @public
 */
const getChangeOrderPaymentMethodEndpoint = () =>
  '/store-api/order/payment'

// context

/**
 * @public
 */
const getContextEndpoint = () => '/store-api/context'

/**
 * @public
 */
const getContextCurrencyEndpoint = () => '/store-api/currency'

/**
 * @public
 */
const getContextSalutationEndpoint = () => '/store-api/salutation'

/**
 * @public
 */
const getSeoUrlEndpoint = () => '/store-api/seo-url'

/**
 * @public
 */
const getGetWishlistProductsEndpoint = () =>
  '/store-api/customer/wishlist'

/**
 * @public
 */
const getAddWishlistProductEndpoint = productId =>
  `/store-api/customer/wishlist/add/${productId}`

/**
 * @public
 */
const getRemoveWishlistProductEndpoint = productId =>
  `/store-api/customer/wishlist/delete/${productId}`

/**
 * @public
 */
const getMergeWishlistProductsEndpoint = () =>
  '/store-api/customer/wishlist/merge'

module.exports = {
  getCategoryEndpoint,
  getCategoryDetailsEndpoint,
  getProductListingEndpoint,
  getProductEndpoint,
  getProductDetailsEndpoint,
  getCustomerEndpoint,
  getCustomerLoginEndpoint,
  getCustomerLogoutEndpoint,
  getCustomerUpdatePaymentMethodEndpoint,
  getCheckoutCartEndpoint,
  getCheckoutCartLineItemEndpoint,
  getRemoveCartLineItemEndpoint,
  getChangeOrderPaymentMethodEndpoint,
  getContextEndpoint,
  getContextCurrencyEndpoint,
  getContextSalutationEndpoint,
  getSeoUrlEndpoint,
  getGetWishlistProductsEndpoint,
  getAddWishlistProductEndpoint,
  getRemoveWishlistProductEndpoint,
  getMergeWishlistProductsEndpoint
}
