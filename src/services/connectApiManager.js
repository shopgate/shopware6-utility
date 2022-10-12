'use strict'

const { invokeGet } = require('@shopware-pwa/shopware-6-client')

const getLoginEndpoint = () => 'sgwebcheckout/login'
const getLoginTokenEndpoint = () => '/store-api/sgwebcheckout/login/token'

/**
 * @param {ApiteSW6Utility.SWApiInstance?} api
 * @returns {Promise<SGConnectAPI.LoginTokenResponse>}
 */
const getLoginToken = async (api) => invokeGet({ address: getLoginTokenEndpoint() }, api).then(({ data }) => data)

/**
 * @param {string} baseUrl - the base Url to append login controller, e.g. http://example.com
 * @param {object} props - key/value pairs for Url parameters
 * @returns {URL}
 */
const getLoginUrl = (baseUrl, props) => {
  const url = new URL(getLoginEndpoint(), baseUrl)
  Object.keys(props).forEach(key => url.searchParams.append(key, props[key]))

  return url
}

module.exports = { getLoginToken, getLoginUrl }
