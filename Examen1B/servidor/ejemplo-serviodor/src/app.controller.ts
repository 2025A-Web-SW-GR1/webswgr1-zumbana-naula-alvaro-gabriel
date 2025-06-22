import { Body, Controller, Get, Headers, HttpCode, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  // Datos simulados en memoria
  private casas = [
    { id: 1, nombre: 'Casa 1' },
    { id: 2, nombre: 'Casa 2' },
  ];

  @Get('/casa')
  getCasa(@Query('idCasa') idCasa: string) {
    if (!idCasa) {
      return this.casas; // Si no se recibe parámetro, se devuelven todas
    }

    const id = parseInt(idCasa);
    const casa = this.casas.find(c => c.id === id);

    if (casa) {
      return [casa]; // Devolver en arreglo
    } else {
      throw new HttpException('No se encuentra', HttpStatus.NOT_FOUND);
    }
  }
}