'use strict'

const axios = require('axios')
const { getContextToken, saveContextToken } = require('./contextManager')
const { getEndpoint, getAccessToken, getLanguageId } = require('./configManager')
const { errorInterceptor } = require('./errorManager')
const { decorateMessage } = require('../services/logDecorator')()

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @param {boolean} saveToken - whether to save the token to storage after a successful API call
 * @returns {AxiosInstance}
 */
const createApiConfig = async (context, saveToken = true) => {
  const contextToken = await getContextToken(context)

  const axiosClient = axios.create({
    baseURL: getEndpoint(context),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'sw-access-key': getAccessToken(context),
      'sw-language-id': getLanguageId(context),
      ...contextToken ? { 'sw-context-token': contextToken } : {}
    }
  })

  // when this check is present, our plugin extends the current expired customer/guest session
  axiosClient.defaults.headers.common['shopgate-check'] = 'true'
  if (process.env.XDEBUG) {
    axiosClient.defaults.headers.common.Cookie = 'XDEBUG_SESSION=XDEBUG_ECLIPSE;'
    axiosClient.defaults.withCredentials = true
  }

  axiosClient.interceptors.response.use(async resp => {
    // if current user's token changes it will be saved to SG storage
    // todo: save context token if it changed, retrieve from Header, with fallback
    const respToken = extractContextToken(resp)
    if (contextToken !== respToken && saveToken) {
      const whom = context.meta.userId ? 'user' : 'guest'
      context.log.debug(decorateMessage(`Changed for ${whom} FROM: '${contextToken}' TO: '${respToken}'`))
      await saveContextToken(respToken, context)
    }
    return resp.data
  }, async err => errorInterceptor(err, context))

  return axiosClient
}

/**
 * @param {AxiosResponse} response
 * @return {string}
 */
const extractContextToken = response =>
  response.data['sw-context-token'] ||
  response.data.contextToken ||
  response.headers['sw-context-token']

module.exports = { createApiConfig }
