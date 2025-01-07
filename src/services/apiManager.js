'use strict'

const {
  getCheckoutCartEndpoint,
  getCheckoutCartLineItemEndpoint,
  getProductEndpoint,
  getProductListingEndpoint,
  getRemoveCartLineItemEndpoint,
  getContextEndpoint,
  getCustomerLoginEndpoint,
  getCustomerLogoutEndpoint,
  getGetWishlistProductsEndpoint,
  getAddWishlistProductEndpoint,
  getRemoveWishlistProductEndpoint
} = require('../lib/endpoints')

/**
 * @param {AxiosInstance} axios
 * @returns {Promise<Cart>}
 *
 * @throws ClientApiError
 * @public
 */
const getCart = async axios => axios.get(getCheckoutCartEndpoint())

/**
 * @param {AxiosInstance} axios
 * @returns {Promise<{ success: boolean }>}
 *
 * @throws ClientApiError
 * @public
 */
const deleteCart = async axios => axios.delete(getCheckoutCartEndpoint())

/**
 * Adds multiple items to the cart.
 * Accepts every type of cart item.
 *
 * @param {AxiosInstance} axios
 * @param {Partial<LineItem>[]} items
 * @returns {Promise<Cart>}
 *
 * @throws ClientApiError
 * @public
 */
const addCartItems = async (axios, items) => axios.post(getCheckoutCartLineItemEndpoint(), { items })

/**
 * @param {AxiosInstance} axios
 * @param {string[]} ids
 * @returns {Promise<Cart>}
 *
 * @throws ClientApiError
 * @public
 */
const removeCartItems = async (axios, ids) => axios.post(getRemoveCartLineItemEndpoint(), { ids })

/**
 * @param {AxiosInstance} axios
 * @param {Partial<LineItem>[]} items
 * @returns {Promise<Cart>}
 *
 * @throws ClientApiError
 * @public
 */
const changeCartItemQuantity = async (axios, items) => axios.patch(getCheckoutCartLineItemEndpoint(), { items })

/**
 * @param {AxiosInstance} axios
 * @param {?ShopwareSearchParams} criteria
 * @returns {Promise<EntityResult<'product', Product[]>>}
 *
 * @throws ClientApiError
 * @public
 */
const getProducts = async (axios, criteria = {}) => axios.post(getProductEndpoint(), criteria)

/**
 * @param {AxiosInstance} axios
 * @param {string} categoryId
 * @param {?ShopwareSearchParams} criteria
 * @returns {Promise<ProductListingResult>}
 *
 * @throws ClientApiError
 * @public
 */
const getProductListing = async (axios, categoryId, criteria = {}) => axios.post(getProductListingEndpoint(categoryId), criteria)

/**
 * Loads session context, containing all session-related data.
 * @param {AxiosInstance} axios
 * @returns {Promise<SessionContext>}
 *
 * @throws ClientApiErrosr
 * @public
 */
const getSessionContext = async axios => axios.get(getContextEndpoint())

/**
 * The response is overwritten by the interceptor
 *
 * @param {AxiosInstance} axios
 * @param {{ username?: string; password?: string }} params
 * @returns {Promise<string>}
 *
 * @throws ClientApiError
 * @public
 */
const login = async (axios, params) => axios.post(getCustomerLoginEndpoint(), params)

/**
 * @param {AxiosInstance} axios
 * @returns {Promise<void>}
 *
 * @throws ClientApiError
 * @public
 */
const logout = async axios => axios.post(getCustomerLogoutEndpoint())

/**
 * @param {AxiosInstance} axios
 * @param {?ShopwareSearchParams} criteria
 * @return {Promise<CustomerWishlistResponse>}
 *
 * @remarks Only for logged-in users
 * @throws ClientApiError
 * @public
 */
const getWishlistProducts = async (axios, criteria = undefined) => axios.post(getGetWishlistProductsEndpoint(), criteria)

/**
 * @param {AxiosInstance} axios
 * @param {string} productId
 * @return {Promise<{ apiAlias: string; success: boolean; }>}
 *
 * @remarks Only for logged-in users
 * @throws ClientApiError
 * @public
 */
const addWishlistProduct = async (axios, productId) => axios.post(getAddWishlistProductEndpoint(productId))

/**
 * @param {AxiosInstance} axios
 * @param {string} productId
 * @return {Promise<{ apiAlias: string; success: boolean; }>}
 *
 * @remarks Only for logged-in users
 * @throws ClientApiError
 * @public
 */
const removeWishlistProduct = async (axios, productId) => axios.delete(getRemoveWishlistProductEndpoint(productId))

module.exports = {
  addCartItems,
  addWishlistProduct,
  changeCartItemQuantity,
  deleteCart,
  getCart,
  getProducts,
  getProductListing,
  getSessionContext,
  getWishlistProducts,
  login,
  logout,
  removeCartItems,
  removeWishlistProduct
}
