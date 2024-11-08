import { Injectable } from '@nestjs/common';
import { KnexService } from '~/database/knex.service';
import { TSaveTariff } from 'modules/wb/types/save.tariff.type';
import { TTariff } from 'modules/wb/types/tariff.type';

@Injectable()
export class WbService {
  constructor(private readonly knexService: KnexService) {}

  /**
   * Saves a tariff record to the database.
   *
   * This function inserts a new tariff record into the 'wb_tariffs' table.
   * If a record with the same 'warehouseName' and 'dtNextBox' already exists,
   * it merges the new data with the existing record.
   *
   * @param payload - An object containing the tariff details to be saved.
   * @param payload.warehouse - An object containing warehouse-related tariff information.
   * @param payload.warehouse.warehouseName - The name of the warehouse.
   * @param payload.warehouse.boxDeliveryAndStorageExpr - The expression for box delivery and storage.
   * @param payload.warehouse.boxDeliveryBase - The base rate for box delivery.
   * @param payload.warehouse.boxDeliveryLiter - The rate per liter for box delivery.
   * @param payload.warehouse.boxStorageBase - The base rate for box storage.
   * @param payload.warehouse.boxStorageLiter - The rate per liter for box storage.
   * @param payload.dtTillMax - The maximum date till which the tariff is valid.
   * @param payload.dtNextBox - The next box delivery date.
   *
   * @returns A Promise that resolves when the operation is complete. It doesn't return any value.
   * @throws Will throw an error if the database insert or merge operation fails.
   */
  async saveTariff(payload: TSaveTariff): Promise<void> {
    const { warehouse, dtTillMax, dtNextBox } = payload;
    const tariffData = {
      warehouseName: warehouse.warehouseName,
      boxDeliveryAndStorageExpr: warehouse.boxDeliveryAndStorageExpr,
      boxDeliveryBase: warehouse.boxDeliveryBase,
      boxDeliveryLiter: warehouse.boxDeliveryLiter,
      boxStorageBase: warehouse.boxStorageBase,
      boxStorageLiter: warehouse.boxStorageLiter,
      dtNextBox: dtNextBox,
      dtTillMax: dtTillMax,
    };

    await this.knexService
      .getTable('wb_tariffs')
      .insert(tariffData)
      .onConflict(['warehouseName', 'dtNextBox'])
      .merge(tariffData);
  }

  /**
   * Retrieves all unexported tariffs records from the database.
   *
   * This function queries the 'wb_tariffs' table and returns all rows where the 'exported' column is null,
   * indicating that these tariffs have not yet been exported.
   *
   * @returns A Promise that resolves to an array of TTariff objects representing the unexported tariffs records.
   * @throws Will throw an error if the database query fails.
   */
  async getUnexportedTariffRows(): Promise<TTariff[]> {
    return this.knexService.getTable('wb_tariffs').whereNull('exportedAt');
  }

  /**
   * Marks specified tariff records as exported in the database.
   *
   * @param ids - An array of string identifiers for the tariff records to be marked as exported.
   * @returns A Promise that resolves when the operation is complete. It doesn't return any value.
   * @throws Will throw an error if the database update operation fails.
   */
  async markTariffAsExported(ids: string[]): Promise<void> {
    await this.knexService
      .getTable('wb_tariffs')
      .whereIn('id', ids)
      .update({ exportedAt: new Date() });
  }
}
