/**
 * @beta
 */
export enum ErrorLevel {
  NOTICE = 0,
  WARNING = 10,
  ERROR = 20,
}

/**
 * @beta
 */
export interface EntityError {
  id: string;
  name: string;
  quantity: number;
  message: string;
  code: number;
  key: string;
  level: ErrorLevel | number;
  parameters: [key: string]; // starting 6.6.7.0
  block: boolean; // starting 6.6.7.0
  blockResubmit: boolean; // starting 6.6.7.0
  messageKey:
    | "product-stock-reached"
    | "product-out-of-stock"
    | "product-not-found"
    | "purchase-steps-quantity"
    | string;
}
