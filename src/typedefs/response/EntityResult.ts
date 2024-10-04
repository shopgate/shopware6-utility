/**
 * @beta
 */
export interface EntityResult<ENTITY_TYPE, ENTITY> {
  entity: ENTITY_TYPE;
  total: number;
  aggregations: any[];
  page: number;
  limit: null | number;
  elements: ENTITY;
  apiAlias: string;
}
