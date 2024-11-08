import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { WbModule } from 'modules/wb/wb.module';
import { DatabaseModule } from '~/database/database.module';
import { SheetsModule } from 'modules/sheets/sheets.module';
import {
  environmentConfig,
  environmentConfigSchema,
} from '~/config/environment.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environmentConfig],
      validate: (config) => {
        const parsed = environmentConfigSchema.safeParse(config);
        if (!parsed.success) {
          throw new Error(`Config validation error: ${parsed.error.message}`);
        }
        return parsed.data;
      },
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    SheetsModule,
    WbModule,
  ],
})
export class AppModule {}
