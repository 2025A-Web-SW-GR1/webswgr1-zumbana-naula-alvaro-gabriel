import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CasaModule } from './casa/casa.module';

@Module({
  imports: [
    DatabaseModule,
    CasaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}