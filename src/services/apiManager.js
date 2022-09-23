'use strict'

const { createInstance } = require('@shopware-pwa/shopware-6-client')
const { getContextToken, saveContextToken } = require('./contextManager')
const { getEndpoint, getAccessToken, getLanguageId } = require('./configManager')

/**
 * @param {ApiteSW6Utility.PipelineContext} context
 * @param {ApiteSW6Utility.SWClientSettings|{}} config
 * @param {boolean} saveToken - whether to save the token to storage after a successful API call
 * @returns {ApiteSW6Utility.SWApiInstance}
 */
const createApiConfig = async (context, config = {}, saveToken = true) => {
  const endpoint = getEndpoint(context)
  const accessToken = getAccessToken(context)
  const languageId = getLanguageId(context)
  const contextToken = await getContextToken(context)

  /** @var {ApiteSW6Utility.SWClientSettings} newConfig */
  const newConfig = Object.assign({
    endpoint,
    accessToken,
    languageId,
    contextToken
  }, config)

  const instance = createInstance(newConfig)
  // when this check is present, our plugin extends the current expired customer/guest session
  instance.defaults.headers.common['shopgate-check'] = 'true'

  // if current user's token changes it will be saved to SG storage
  instance.onConfigChange(
    async ({ config }) => {
      if (contextToken !== config.contextToken && saveToken) {
        const whom = context.meta.userId ? 'user' : 'guest'
        context.log.debug(`Changed for ${whom} FROM: '${contextToken}' TO: '${config.contextToken}'`)
        await saveContextToken(config.contextToken, context)
      }
    }
  )

  return instance
}

module.exports = { createApiConfig }
