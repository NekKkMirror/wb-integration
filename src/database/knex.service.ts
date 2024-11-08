import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { KNEX_CONNECTION_PROVIDER } from './database.module';
import { Knex } from 'knex';

@Injectable()
export class KnexService {
  constructor(
    @Inject(forwardRef(() => KNEX_CONNECTION_PROVIDER))
    private readonly db: Knex,
  ) {}

  getTable(tableName: string) {
    return this.db(tableName);
  }
}
