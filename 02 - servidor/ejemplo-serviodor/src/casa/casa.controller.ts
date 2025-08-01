import {
    BadRequestException,
    Body,
    Controller, Delete, Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
    Response,
} from '@nestjs/common';
import { CasaService } from './casa.service';
import { FindManyOptions, Like } from 'typeorm';
import { BuscarDto } from './dto/buscar.dto';
import { Casa } from './casa.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CasaEditarDto } from './dto/casa-editar.dto';
import { CrearEditarBaseDto } from './dto/crear-editar.base.dto';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('api/casa')
export class CasaController {
    constructor(
        private readonly casaService: CasaService
    ) {

    }
    @Get()
    obtener(
        @Query() parametrosConsulta: BuscarDto,
    ) {
        const objetoBusqueda: FindManyOptions<Casa> = {};
        if (parametrosConsulta.nombre) {
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
    ) {
        return this.casaService.crearUno(parametrosCuerpo);
    }
    @Get(':id')
    async obtenerUno(
        @Param('id') id: string,
    ) {
        const numeroCasteado = Number(id);
        const numeroValido = !isNaN(numeroCasteado);
        if (numeroValido) {
            const registroEncontrado = await this.casaService.obtenerUnoPorId(numeroCasteado);
            if (registroEncontrado !== null) {
                return registroEncontrado;
            }
            throw new NotFoundException('Registro no encontrado');
        } else {
            throw new BadRequestException('No es un id valido');
        }
    }
    @Put(':id')
    actualizarUnoPorId(
        @Body() parametrosCuerpo: CasaEditarDto,
        @Param('id') id: string
    ) {
        try {
            return this.casaService.actualizarUnoPorId(
                parametrosCuerpo,
                +id,
            );
        } catch (e) {
            throw new NotFoundException('Registro no encontrado, o error del servidor')
        }
    }
    @Delete(':id')
    async eliminarUnoPorId(
        @Param('id') id: string,
    ) {
        const response = await this.casaService.eliminarUnoPorId(+id);
        if (response.affected === 1) {
            return {
                mensaje: 'Eliminado correctamente',
            };
        }
        throw new BadRequestException('No se encontro el registro');
    }

    // Como subir un archivo al servidor, docs:
    // https://docs.nestjs.com/techniques/file-upload
    // Instalar el paquete:
    // npm i -D @types/multer
    @Post('uploadFile/:id')
    @UseInterceptors(FileInterceptor('archivoASubir', { dest: './uploads' }))
    async subirArchivo(
        @UploadedFile() file: Express.Multer.File,
        @Param('id') id: string,
    ) {
        // No mas de 5 megas
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

    @Get('streamDownloadFile/:id')
    async stream(
        @Res() response: any,
        @Param('id') id: string,
    ) {
        const respuestaCasa = await this.casaService.obtenerUnoPorId(+id);
        // Obtenemos el nombre original, guardado y el tipo de archivo para poder descargar
        const file = createReadStream(join(process.cwd(), './uploads/' + respuestaCasa?.fileID));
        // Tipo de contenido
        response.contentType(respuestaCasa?.fileContentType);
        // Nombre de archivo
        response.setHeader('Content-Disposition', `attachment; filename="${respuestaCasa?.filename}"`);
        // En este caso estamos descargando como un STREAM de datos, 
        // Hay otras formas para descargar como un buffer de datos tambien.
        file.pipe(response as any);
    }
}