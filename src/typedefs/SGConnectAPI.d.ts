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
}
