import { Injectable } from '@nestjs/common';
import { WbApiService } from './wb-api.service';
import { WbService } from './wb.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SheetsService } from 'modules/sheets/sheets.service';

@Injectable()
export class WbTask {
  constructor(
    private readonly wbApiService: WbApiService,
    private readonly wbService: WbService,
    private readonly sheetsService: SheetsService,
  ) {}

  /**
   * Saves tariff information for each warehouse by retrieving data from the WbApiService.
   * The function fetches the next box date, the maximum till date, and a list of warehouses,
   * then saves the tariff information for each warehouse using the WbService.
   *
   * @returns {Promise<void>} A promise that resolves when the tariff information has been saved for all warehouses.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async saveTariffs(): Promise<void> {
    const { dtNextBox, dtTillMax, warehouseList } =
      await this.wbApiService.getTariff();
    for (const warehouse of warehouseList) {
      await this.wbService.saveTariff({ warehouse, dtNextBox, dtTillMax });
    }
  }

  /**
   * Exports unexported tariff rows to Google Sheets.
   *
   * This function retrieves unexported tariff rows from the database using the WbService.
   * If there are any unexported rows, it exports the data to Google Sheets using the SheetsService.
   * After exporting the data, it marks the exported rows as exported in the database using the WbService.
   *
   * @returns {Promise<void>} A promise that resolves when the unexported rows have been exported to Google Sheets.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async exportUnexportedRows() {
    const unexportedRows = await this.wbService.getUnexportedTariffRows();

    if (unexportedRows.length > 0) {
      await this.sheetsService.exportDataToSheets(unexportedRows);
      const ids = unexportedRows.map((row) => row.id);
      await this.wbService.markTariffAsExported(ids);
    }
  }
}
