'use strict'

const { invokeGet } = require('@shopware-pwa/shopware-6-client')

const getLoginTokenEndpoint = () => '/store-api/sgconnect/login/token'

/**
 * @param {ApiteSW6Utility.SWApiInstance?} api
 * @returns {Promise<SGConnectAPI.LoginTokenResponse>}
 */
const getLoginToken = async (api) => invokeGet({ address: getLoginTokenEndpoint() }, api).then(({ data }) => data)

module.exports = { getLoginToken }
