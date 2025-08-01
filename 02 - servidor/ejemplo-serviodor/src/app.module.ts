import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CasaModule } from './casa/casa.module';
import { AuthController } from './app.auth-controller';

@Module({
  imports: [
    DatabaseModule,
    CasaModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule { }
