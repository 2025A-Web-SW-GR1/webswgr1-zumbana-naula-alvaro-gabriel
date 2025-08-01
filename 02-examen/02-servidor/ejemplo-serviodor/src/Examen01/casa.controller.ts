import { Controller, Get, Query, HttpException, HttpCode } from '@nestjs/common';

@Controller('casa')
export class CasaController {
  private casas = [
    { id: 1, nombre: "Casa 1" },
    { id: 2, nombre: "Casa 2" }
  ];

  @Get()
  @HttpCode(200)
  getCasa(@Query('idCasa') idCasa?: string) {
    if (!idCasa) {
      return this.casas;
    }
    const id = Number(idCasa);
    const casa = this.casas.find(c => c.id === id);
    if (casa) {
      return [casa];
    } else {
      throw new HttpException('No se encuentra', 404);
    }
  }
}