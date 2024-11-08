export type TWbApiTariffResponse = {
  readonly response: {
    readonly data: TWbApiTariffResponseData;
  };
};

export type TWbApiTariffResponseData = {
  readonly dtNextBox: string;
  readonly dtTillMax: string;
  readonly warehouseList: TWbApiTariffWarehouse[];
};

export type TWbApiTariffWarehouse = {
  readonly boxDeliveryAndStorageExpr: string;
  readonly boxDeliveryBase: string;
  readonly boxDeliveryLiter: string;
  readonly boxStorageBase: string;
  readonly boxStorageLiter: string;
  readonly warehouseName: string;
};
