import {
  TWbApiTariffResponseData,
  TWbApiTariffWarehouse,
} from 'modules/wb/types/wb-api.types';
import { TTariffResponse, TWarehouse } from 'modules/wb/types/tariff.type';

export class WbApiParserService {
  /**
   * Parses the raw tariff data received from the Wildberries API into a structured format.
   *
   * This function transforms the raw TWarehouse data, converting string values to appropriate
   * number types and handling special cases. It also processes date information.
   *
   * @param data - The raw tariff data received from the Wildberries API.
   * @param data.warehouseList - An array of TWarehouse objects containing tariff information.
   * @param data.dtNextBox - The date for the next box delivery, if available.
   * @param data.dtTillMax - The maximum date for which the tariff information is valid.
   *
   * @returns A structured TTariffResponse object containing:
   *   - dtNextBox: Date object for the next box delivery, or null if not provided.
   *   - dtTillMax: Date object representing the maximum validity date of the tariff information.
   *   - warehouseList: An array of TWarehouse objects with parsed numeric values and TWarehouse names.
   */
  static parseTariffData(data: TWbApiTariffResponseData): TTariffResponse {
    const warehouseList: TWarehouse[] = data.warehouseList.map(
      (TWarehouse: TWbApiTariffWarehouse): TWarehouse => ({
        boxDeliveryAndStorageExpr: parseFloat(
          TWarehouse.boxDeliveryAndStorageExpr,
        ),
        boxDeliveryBase: parseFloat(TWarehouse.boxDeliveryBase),
        boxDeliveryLiter: parseFloat(
          TWarehouse.boxDeliveryLiter.replace(',', '.'),
        ),
        boxStorageBase:
          TWarehouse.boxStorageBase === '-'
            ? null
            : parseFloat(TWarehouse.boxStorageBase),
        boxStorageLiter:
          TWarehouse.boxStorageLiter === '-'
            ? null
            : parseFloat(TWarehouse.boxStorageLiter),
        warehouseName: TWarehouse.warehouseName,
      }),
    );

    return {
      dtNextBox: data.dtNextBox ? new Date(data.dtNextBox) : null,
      dtTillMax: new Date(data.dtTillMax),
      warehouseList,
    };
  }
}
