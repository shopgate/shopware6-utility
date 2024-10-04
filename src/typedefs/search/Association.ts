/**
 * @beta
 */
export interface ShopwareAssociation {
  [name: string]: {
    'total-count-mode':  number,
    associations?: ShopwareAssociation;
    sort?:
      | {
          field: string;
          order: string;
          naturalSorting: boolean;
        }[]
      | string;
  };
}
