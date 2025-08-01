import { Module } from '@nestjs/common';
import { CasaController } from './casa.controller';
import { CasaService } from './casa.service';
import { casaProviders } from './casa.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CasaController],
  providers: [
    ...casaProviders,
    CasaService,
  ],
  exports: [CasaService],
})
export class CasaModule {}