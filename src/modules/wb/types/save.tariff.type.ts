import { TWarehouse } from './tariff.type';

export type TSaveTariff = {
  warehouse: TWarehouse;
  dtNextBox: Date | null;
  dtTillMax: Date;
};
