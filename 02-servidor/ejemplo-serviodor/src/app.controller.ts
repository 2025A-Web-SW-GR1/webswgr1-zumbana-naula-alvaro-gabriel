import { Body, Controller, Get, Headers, HttpCode, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() //Decorador
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/ejemplo/:id') ///ejemplo/1?hola=mundo
  @HttpCode(200)
    ejemplo(
    @Param('id') id, //Parametro de ruta llamado id
    @Query('hola') hola, //Parametro de consulta llamado hola
    @Headers('escuela') escuela, //Cabecera con nombre 'escuela'
    @Body('monto') monto, //
  ): string {
    return id + hola + 'Funcionando' + escuela + monto
  }
}
