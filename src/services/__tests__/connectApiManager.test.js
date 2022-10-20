/* eslint-disable no-undef */
'use strict'

beforeEach(() => {
  jest.resetModules()
})

const dataProvider = [
  {
    endpoint: 'http://test',
    registrationPath: '/sgwebcheckout/register',
    url: 'http://test/sgwebcheckout/login?token=someToken'
  },
  {
    endpoint: 'http://test',
    registrationPath: 'sgwebcheckout/register',
    url: 'http://test/sgwebcheckout/login?token=someToken'
  },
  {
    endpoint: 'http://test/sub',
    registrationPath: '/sgwebcheckout/register',
    url: 'http://test/sub/sgwebcheckout/login?token=someToken'
  },
  {
    endpoint: 'http://test/sub',
    registrationPath: 'sgwebcheckout/register',
    url: 'http://test/sub/sgwebcheckout/login?token=someToken'
  },
  {
    endpoint: 'http://test/sub/',
    registrationPath: 'sgwebcheckout/register',
    url: 'http://test/sub/sgwebcheckout/login?token=someToken'
  },
  {
    endpoint: 'http://test/sub/',
    registrationPath: '/sgwebcheckout/register',
    url: 'http://test/sub/sgwebcheckout/login?token=someToken'
  }
]

describe.each(dataProvider)('Register URL Check', ({ endpoint, registrationPath, url }) => {
  it(`should pass based on endpoint: ${endpoint} & registration: ${registrationPath}`, () => {
    const { getLoginUrl } = require('../connectApiManager')
    expect(getLoginUrl(endpoint, { token: 'someToken' }).toString()).toEqual(url)
  })
})
