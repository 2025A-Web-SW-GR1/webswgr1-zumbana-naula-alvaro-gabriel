import { Module } from '@nestjs/common';
import { casaProviders } from './casa.repository';
import { CasaController } from './casa.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CasaService } from './casa.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    DatabaseModule,
    MulterModule
  ],
  controllers: [CasaController],
  providers: [
    ...casaProviders,
    CasaService,
  ],
  exports: [
    ...casaProviders,
    CasaService,
  ]
})
export class CasaModule { }