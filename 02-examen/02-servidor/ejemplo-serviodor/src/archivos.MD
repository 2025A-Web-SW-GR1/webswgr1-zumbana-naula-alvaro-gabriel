## Archivos

Para subir archivos vamos a utilizar `multer` un paquete de node.js que ayuda con toda la logica para obtener archivos. Dentro de nuestro framework Nest.js podemos trabajar sin problemas con esto. Vamos a necesitar algunas nuevas columnas en la base de datos para poder guardar 1 archivo por `entidad` (casa), tambien vamos a crear metodos para guardar esta nueva informacion en el servicio. Para descargar el archivo vamos a leer el archivo que esta guardado en este registro y lo vamos a STREMEAR al cliente. En resumen haremos cambios en:
-  Entidad (bdd)
-  Servicio (guardar la informacion del archivo)
-  Controlador (logica de subir y descargar archivos)
-  Casa.module.ts (Configurar el modulo de archivos)

## Instalacion de paquetes

Lo primero que vamos a realizar es instalar los paquetes necesarios:

```bash
npm i -D @types/multer
```

## Configuracion en Entidad `casa.entity.ts`

Dentro de nuesto archivo de entidad vamos a agregar 3 nuevas columnas, estas columnas van a guardar la siguiente informacion:

-  `filename` : Nombre del archivo original
-  `fileContentType` : Tipo de contenido (pdf, excel, texto plano, etc)
-  `fileID` : Nombre del identificador del archivo creado

```typescript

  @Column({ nullable: true })
  fileContentType?: string;

  @Column({ nullable: true })
  filename?: string;

  @Column({ nullable: true })
  fileID?: string;
```


## Configuracion servicio `Casa.service.ts`

Para subir y guardar la informacion de los archivos que subimos vamos a actualizar la entidad con los valores necesarios:

```typescript
    async actualizarArchivoPorId(
        valoresAActualizar: {
            fileContentType: string;
            filename: string;
            fileID: string;
        },
        id: number
    ) {
        const recordExist = await this.casaRepository.findOneByOrFail({ id });
        let registroActualizar = this.casaRepository.create();
        registroActualizar = {
            ...registroActualizar,
            ...valoresAActualizar
        }
        registroActualizar.id = recordExist.id;
        return this.casaRepository.save(registroActualizar);
    }
```



## Configuracion controlador `Casa.contrller.ts`

Aqui es donde esta la logica mas fuerte de los dos metodos. Vamos a revisar cada una:

### Subir archivos

Para subir archivos vamos a aceptar el `id` de la entidad y vamos a definir en que carpeta vamos a guardar el archivo. Gracias a Nest.js y Multer vamos a obtener toda la informacion importante del archivo y lo vamos a guardar:

```typescript
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
```

### Descargar archivos

Para descargar archivos se puede enviar el archivo por `buffer` o por `stream`, en este caso vamos a usar el `stream`:

```typescript


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
```
