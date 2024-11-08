import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { TTariff } from 'modules/wb/types/tariff.type';
import * as path from 'path';

@Injectable()
export class SheetsService {
  constructor(private configService: ConfigService) {}

  /**
   * Exports data to Google Sheets.
   *
   * @param data - An array of {@link TTariff} objects to be exported.
   * @returns A Promise that resolves when the data is successfully exported to all specified Google Sheets.
   *
   * @remarks
   * This function uses the Google Sheets API to update a specified range in one or more Google Sheets with the provided data.
   * The data is sorted by the `boxDeliveryAndStorageExpr` property in ascending order before being exported.
   * The exported data includes the following columns:
   * - Warehouse Name
   * - Box Delivery & Storage Expr
   * - Box Delivery Base
   * - Box Delivery Liter
   * - Box Storage Base
   * - Box Storage Liter
   * - Next Box Date
   * - Till Max Date
   * - Created At
   *
   * The function retrieves the Google Sheet IDs from the application configuration and uses them to update the specified range in each sheet.
   *
   * @throws Will throw an error if the Google Sheets API request fails.
   */
  async exportDataToSheets(data: TTariff[]): Promise<void> {
    const sheetsIds = <string[]>(
      this.configService.get<string[]>('app.googleSheetIds')
    );
    const sheets = google.sheets({
      version: 'v4',
      auth: new google.auth.GoogleAuth({
        keyFile: path.join(process.cwd(), 'google-credentials.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      }),
    });
    const headers = [
      'Warehouse Name',
      'Box Delivery & Storage Expr',
      'Box Delivery Base',
      'Box Delivery Liter',
      'Box Storage Base',
      'Box Storage Liter',
      'Next Box Date',
      'Till Max Date',
      'Created At',
    ];
    const sortedData = data.sort(
      (a, b) => a.boxDeliveryAndStorageExpr - b.boxDeliveryAndStorageExpr,
    );

    const values = <string[][]>[
      headers,
      ...sortedData.map((row) => [
        row.warehouseName,
        row.boxDeliveryAndStorageExpr,
        row.boxDeliveryBase,
        row.boxDeliveryLiter,
        row.boxStorageBase,
        row.boxStorageLiter,
        row.dtNextBox ? row.dtNextBox.toISOString().split('T')[0] : '',
        row.dtTillMax.toISOString().split('T')[0],
        row.createdAt.toISOString().split('T')[0],
      ]),
    ];

    for (const sheetId of sheetsIds) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'stocks_coefs!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
    }
  }
}
