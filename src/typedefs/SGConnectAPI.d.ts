import { ShopwareError } from './index'

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
    expires: undefined | string; // e.g 2022-09-23T14:43:30.000Z
  }

  interface ContextTokenParam {
    contextToken: string; // shopware context token (guest or customer)
  }

  interface BasicErrorLog {
    extension: string;
    message: undefined | string;
    stack: undefined | string;
  }

  interface ClientApiErrorLog {
    extension: string;
    errors: Array<ShopwareError & {
      meta: string;
      trace: string;
    }>
  }

  interface GetProductsInput {
    offset?: number;
    limit?: number;
    categoryId?: string;
    searchPhrase?: string;
    sort?: string;
    filters?: object; // complex
    showInactive?: boolean;
    productIds?: string[];
  }

  interface GetProductsOutput {
    totalProductCount: number;
    products: [
      {
        id: string;
        active: boolean;
        availability: {
          text: string;
          state: string; // e.g. 'ok'
        };
        identifiers: {
          sku: string;
          ean: string;
          isbn: string;
          upc: string;
          pzn: string;
          mpn: string
        };
        manufacturer: string;
        name: string;
        stock: {
          info: string;
          orderable: boolean;
          quantity: number;
          maxOrderQuantity: number;
          minOrderQuantity: number;
          ignoreQuantity: boolean
        };
        rating: {
          count: number;
          average: number;
          reviewCount: number
        };
        featuredImageUrl: string;
        featuredImageBaseUrl: string;
        price: {
          tiers: [
            {
              from: number;
              to: number;
              unitPrice: number
            }
          ];
          info: string;
          unitPrice: number;
          unitPriceStriked: number;
          unitPriceMin: number;
          unitPriceMax: number;
          unitPriceNet: number;
          unitPriceWithTax: number;
          taxAmount: number;
          taxPercent: number;
          msrp: number;
          currency: string // USD
        };
        flags: {
          hasChildren: boolean;
          hasVariants: boolean;
          hasOptions: boolean
        };
        liveshoppings: [
          {
            from: string; // '2017-11-11T23:59:59.999Z'
            to: string;
          }
        ];
        highlight: boolean;
        characteristics: [];
        type: string; // e.g. simple
        tags: string[]
      }
    ]
  }

  interface FavoriteList {
    id: string;
    name: string;
  }
}
