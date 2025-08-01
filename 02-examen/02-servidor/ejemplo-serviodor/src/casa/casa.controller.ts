import { 
    Body,
    Controller, 
    Get, 
    Post, 
    Query,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CasaService } from './casa.service';
import { FindManyOptions, Like } from 'typeorm';
import { BuscarDto } from './dto/buscar.dto';
import { Casa } from './casa.entity';
import { CrearEditarBaseDto } from './dto/crear-editar.base.dto';

@Controller('api/casa')
export class CasaController {
    constructor(
        private readonly casaService: CasaService
    ) {}

    @Get()
        obtener(
            @Query() parametrosConsulta:BuscarDto,
        ){
            const objetoBusqueda: FindManyOptions<Casa> = {};
            if(parametrosConsulta.nombre){
                objetoBusqueda.where = {
                    nombre: 
                    Like("%" + parametrosConsulta.nombre + "%"),
                }
            }
            return this.casaService.obtenerTodos(objetoBusqueda);
    }

    @Post()
    crearUno(
        @Body() parametrosCuerpo: CrearEditarBaseDto
    ){
        this.casaService.crearUno(
            parametrosCuerpo.nombre,
            parametrosCuerpo.valor,
            parametrosCuerpo.imagenUrl
        );
    }

    // Método para subir archivos
    @Post('uploadFile/:id')
    @UseInterceptors(FileInterceptor('archivoASubir', { dest: './uploads' }))
    async subirArchivo(
        @UploadedFile() file: Express.Multer.File,
        @Param('id') id: string,
    ) {
        // No más de 5 megas
        if (file.size <= 1000 * 1024 * 5) {
            // Guardar archivo en la carpeta upload 
            // En ambientes productivos se puede subir a una nube como el S3 de amazon
            // En nuestro caso para poder descargar el archivo necesitamos
            // 1) Nombre archivo original
            // 2) Tipo archivo
            // 3) Nombre archivo guardado
            // Lo guardamos en la base de datos en el registro de la casa
            await this.casaService.actualizarArchivoPorId({
                fileContentType: file.mimetype,
                fileID: file.filename,
                filename: file.originalname
            }, +id);
            return {
                mensaje: 'Archivo guardado correctamente',
                ...file
            }
        } else {
            throw new BadRequestException('Archivo no valido');
        }
    }

    // Método para descargar archivos
    @Get('streamDownloadFile/:id')
    async stream(
        @Res() response: any,
        @Param('id') id: string,
    ) {
        // Obtenemos el nombre original, guardado y el tipo de archivo para poder descargar
        const respuestaCasa = await this.casaService.obtenerUnoPorId(+id);
        const file = createReadStream(join(process.cwd(), './uploads/' + respuestaCasa?.fileID));
        // Tipo de contenido
        response.contentType(respuestaCasa?.fileContentType);
        // Nombre de archivo
        response.setHeader('Content-Disposition', `attachment; filename="${respuestaCasa?.filename}"`);
        // En este caso estamos descargando como un STREAM de datos, 
        // Hay otras formas para descargar como un buffer de datos tambien.
        file.pipe(response as any);
    }

    // Temporal - agregar en casa.controller.ts para crear un usuario de prueba
    @Post('crear-usuario-prueba')
    crearUsuarioPrueba() {
        return this.casaService.crearUsuarioPrueba(); // Usar el método del servicio
    }
}