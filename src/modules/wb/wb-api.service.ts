import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {
  TWbApiTariffResponse,
  TWbApiTariffResponseData,
} from './types/wb-api.types';
import { TTariffResponse } from './types/tariff.type';
import { WbApiParserService } from 'modules/wb/wb-api-parser.service';

@Injectable()
export class WbApiService {
  private readonly endpoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.endpoint = <string>this.configService.get<string>('app.wbTariffUrl');
  }

  /**
   * Retrieves and processes tariff data from the Wildberries API.
   *
   * This method fetches the raw tariff data using the `fetchTariffs` method,
   * then parses and structures this data using the `parseTariffData` method.
   *
   * @async
   * @returns {Promise<TTariffResponse>} A promise that resolves to a structured TTariffResponse object
   * containing processed tariff information, including TWarehouse list, next box delivery date,
   * and maximum validity date of the tariff information.
   * @throws {Error} If there's an error fetching or parsing the tariff data.
   */
  async getTariff(): Promise<TTariffResponse> {
    const data: TWbApiTariffResponseData = await this.fetchTariff();
    return WbApiParserService.parseTariffData(data);
  }

  /**
   * Fetches tariff data from the Wildberries API endpoint using the provided token.
   *
   * @throws Will throw an error if the request fails or if the response data is not available.
   *
   * @returns {Promise<string>} - A promise that resolves to the fetched tariff data.
   */
  private async fetchTariff(): Promise<TWbApiTariffResponseData> {
    const token: string = <string>(
      this.configService.get<string>('app.wbApiToken')
    );
    const currentDate: string = new Date().toISOString().split('T')[0];
    const {
      data: {
        response: { data: wbApiResponseData },
      },
    } = await lastValueFrom(
      this.httpService.get<TWbApiTariffResponse, string>(
        `${this.endpoint}?date=${currentDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    );

    return wbApiResponseData;
  }
}
