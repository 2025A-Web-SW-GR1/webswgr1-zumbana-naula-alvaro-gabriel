# Informe de Implementación: Servicio REST `/casa`

## Nombre: Maicol Nasimba

## ¿Qué se implementó?

Se desarrolló un servicio RESTful en NestJS para la gestión de casas, cumpliendo con los siguientes requerimientos:

- **Endpoint:** `GET /casa`
- **Respuesta 200:** Devuelve todas las casas si no se envía parámetro.
- **Respuesta 200 con parámetro:** Si se envía el parámetro `idCasa`, devuelve solo la casa correspondiente en un array.
- **Respuesta 404:** Si el `idCasa` no existe, devuelve el mensaje `"No se encuentra"` y el código 404.

## ¿Cómo se implementó?

1. **Controlador separado:**  
   Se creó el archivo [`casa.controller.ts`](./casa.controller.ts) dentro de la carpeta `src/Examen01/` para mantener la lógica separada del controlador principal de la aplicación.

2. **Lógica del endpoint:**  
   - Se definió un array privado con las casas disponibles.
   - El método `getCasa` responde a solicitudes GET en `/casa`.
   - Si no se recibe `idCasa`, retorna todas las casas.
   - Si se recibe `idCasa`, busca la casa correspondiente:
     - Si existe, la retorna en un array.
     - Si no existe, lanza una excepción HTTP 404 con el mensaje requerido.

3. **Registro en el módulo:**  
   Se importó y registró el controlador en [`app.module.ts`](../app.module.ts) para que el endpoint esté disponible en la aplicación.

## Código principal del controlador

```typescript
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