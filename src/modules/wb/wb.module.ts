import { Module } from '@nestjs/common';
import { DatabaseModule } from '~/database/database.module';
import { WbApiService } from './wb-api.service';
import { WbTask } from './wb.task';
import { HttpModule } from '@nestjs/axios';
import { WbService } from './wb.service';
import { SheetsService } from 'modules/sheets/sheets.service';

@Module({
  imports: [HttpModule, DatabaseModule],
  providers: [SheetsService, WbService, WbApiService, WbTask],
})
export class WbModule {}
