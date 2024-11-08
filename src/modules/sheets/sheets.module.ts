import { Module } from '@nestjs/common';
import { SheetsService } from 'modules/sheets/sheets.service';

@Module({
  providers: [SheetsService],
  exports: [SheetsService],
})
export class SheetsModule {}
