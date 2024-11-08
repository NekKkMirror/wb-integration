export type TWarehouse = {
  readonly boxDeliveryAndStorageExpr: number;
  readonly boxDeliveryBase: number;
  readonly boxDeliveryLiter: number;
  readonly boxStorageBase: number | null;
  readonly boxStorageLiter: number | null;
  readonly warehouseName: string;
};

export type TTariffResponse = {
  readonly dtNextBox: Date | null;
  readonly dtTillMax: Date;
  readonly warehouseList: TWarehouse[];
};

export type TTariff = {
  readonly id: string;
  readonly warehouseName: string;
  readonly boxDeliveryAndStorageExpr: number;
  readonly boxDeliveryBase: number;
  readonly boxDeliveryLiter: null;
  readonly boxStorageBase: null;
  readonly boxStorageLiter: number;
  readonly dtNextBox: Date | null;
  readonly dtTillMax: Date;
  readonly exportedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
