import { registerAs } from '@nestjs/config';
import { z } from 'zod';
import * as process from 'node:process';

/**
 * Represents the configuration settings for the application environment.
 *
 * @property port - The port number on which the application will run.
 * @property googleSheetIds - An array of Google Sheet IDs used by the application.
 * @property wbApiToken - The API token for accessing the WB API.
 * @property wbTariffUrl - The URL for the WB tariff service.
 * @property dbUrl - The database connection URL.
 */
export type TEnvironmentConfig = {
  port: number;
  googleSheetIds: string[];
  wbApiToken: string;
  wbTariffUrl: string;
  dbUrl: string;
};

export const environmentConfig = registerAs(
  'app',
  (): TEnvironmentConfig => ({
    port: Number(process.env.APP_PORT),
    googleSheetIds: process.env.GOOGLE_SHEETS_IDS!.split(','),
    wbApiToken: process.env.WB_API_TOKEN!,
    wbTariffUrl: process.env.WB_TARIFF_URL!,
    dbUrl: process.env.DATABASE_URL!,
  }),
);

export const environmentConfigSchema = z.object({
  APP_PORT: z
    .string()
    .transform(Number)
    .refine((port) => port > 0, {
      message: 'APP_PORT must be a positive number',
    }),
  GOOGLE_SHEETS_IDS: z.string().transform((ids) => ids.split(',')),
  WB_API_TOKEN: z.string().min(1, 'WB_API_TOKEN is required'),
  WB_TARIFF_URL: z.string().url('WB_TARIFFS_URL must be a valid URL'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
});
