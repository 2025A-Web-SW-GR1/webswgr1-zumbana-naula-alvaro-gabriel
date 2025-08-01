import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CasaModule } from '../casa/casa.module';

@Module({
  imports: [CasaModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
