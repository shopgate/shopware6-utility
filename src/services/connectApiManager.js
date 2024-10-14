'use strict'

const path = require('path')

const getLoginEndpoint = () => 'sgwebcheckout/login'
const getLoginTokenEndpoint = () => '/store-api/sgwebcheckout/login/token'

/**
 * @param {AxiosInstance} api
 * @returns {Promise<SGConnectAPI.LoginTokenResponse>}
 */
const getLoginToken = async (api) => api.get(getLoginTokenEndpoint())

/**
 * @param {string} baseUrl - the base Url to append login controller, e.g. http://example.com
 * @param {object} props - key/value pairs for Url parameters
 * @returns {URL}
 */
const getLoginUrl = (baseUrl, props) => {
  const url = new URL(path.join(baseUrl, getLoginEndpoint()))
  Object.keys(props).forEach(key => url.searchParams.append(key, props[key]))

  return url
}

module.exports = { getLoginToken, getLoginUrl }
