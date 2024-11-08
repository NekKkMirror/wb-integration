import { NestFactory } from '@nestjs/core';
import { AppModule } from 'modules/app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = <number>configService.get<number>('app.port');

  await app.listen(port);
}
void bootstrap();
