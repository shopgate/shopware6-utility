'use strict'

class TranslatableError extends Error {
  constructor (message, code, params = {}) {
    super()
    this.message = message
    this.code = code
    this.params = params
  }
}

class ThrottledError extends TranslatableError {
  constructor () { super('SW6User.notice.rateLimitExceeded', 'EREQUESTTHROTTLED') }
}

class InvalidCredentialsError extends TranslatableError {
  constructor () { super('SW6User.notice.loginBadCredentials', 'EBADCREDENTIALS') }
}

class InactiveAccountError extends TranslatableError {
  constructor () { super('SW6User.notice.inactiveAccountAlert', 'EINACTIVEACCOUNT') }
}

/**
 * Code handled by theme, guest trying to call customer pipelines
 */
class UnauthorizedError extends TranslatableError {
  constructor () { super('', 'EACCESS') }
}

class UnknownError extends TranslatableError {
  constructor () { super('SW6User.notice.message-default', 'EUNKNOWN') }
}

/**
 * A state of the app that requires the current App user to be logged out.
 * Our frontend subscriber handles this error. Cart ext also has a similar
 * catcher, so it's possible this error may not be fired.
 */
class ContextDeSyncError extends TranslatableError {
  constructor () { super('SW6User.app.not-in-sync', 'EUSERDESYNC') }
}

module.exports = {
  ContextDeSyncError,
  InactiveAccountError,
  InvalidCredentialsError,
  ThrottledError,
  UnauthorizedError,
  UnknownError
}
