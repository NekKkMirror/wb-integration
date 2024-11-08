import { Module } from '@nestjs/common';
import knex from 'knex';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { KnexService } from './knex.service';

export const KNEX_CONNECTION_PROVIDER = 'KNEX_CONNECTION';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: KNEX_CONNECTION_PROVIDER,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        knex({
          client: 'pg',
          connection: configService.get<string>('app.dbUrl'),
          migrations: {
            tableName: 'knex_migrations',
          },
        }),
    },
    KnexService,
  ],
  exports: [KNEX_CONNECTION_PROVIDER, KnexService],
})
export class DatabaseModule {}
