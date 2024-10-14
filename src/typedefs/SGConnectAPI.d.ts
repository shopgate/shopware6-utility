import { ShopwareError } from "./index"

export namespace SGConnectAPI {
  interface LoginTokenResponse {
    token: string;
    expiration: number;
  }

  interface LoginRequest {
    strategy: 'auth_code' | 'basic';
    parameters: LoginStrategyBasic | LoginStrategyToken;
  }

  interface LoginStrategyBasic {
    login: string; // email
    password: string;
  }

  interface LoginStrategyToken {
    code: string; // shopware context token
  }

  interface UrlResponse {
    url: string;
    expires: undefined|string; // e.g 2022-09-23T14:43:30.000Z
  }

  interface ContextTokenParam {
    contextToken: string; // shopware context token (guest or customer)
  }

  interface BasicErrorLog {
    extension: string;
    message: undefined|string;
    stack: undefined|string;
  }

  interface ClientApiErrorLog {
    extension: string;
    errors: Array<ShopwareError & {
      meta: string;
      trace: string;
    }>
  }
}
