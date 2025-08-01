import { Inject, Injectable } from '@nestjs/common';
import { Casa } from './casa.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CasaService {
    constructor(
        @Inject('CASA_REPOSITORY')
        private photoRepository: Repository<Casa>,
    ) {}

    obtenerTodos(
        options?: FindManyOptions<Casa> | undefined
    ) {
        return this.photoRepository.find(options);
    }

    crearUno(nombre: string, valor: number, imagenUrl: string) {
        const nuevaInstancia = this.photoRepository.create();
        nuevaInstancia.nombre = nombre;
        nuevaInstancia.valor = valor;
        nuevaInstancia.imagenURL = imagenUrl;
        return this.photoRepository.save(nuevaInstancia);
    }

    // Nuevo método para buscar por username
    async buscarUnoPorUsername(username: string) {
        return await this.photoRepository.findOneOrFail({
            where: { username }
        });
    }

    async obtenerUnoPorId(id: number) {
        return await this.photoRepository.findOneOrFail({
            where: { id }
        });
    }

    async actualizarArchivoPorId(
        valoresAActualizar: {
            fileContentType: string;
            filename: string;
            fileID: string;
        },
        id: number
    ) {
        const recordExist = await this.photoRepository.findOneByOrFail({ id });
        let registroActualizar = this.photoRepository.create();
        registroActualizar = {
            ...registroActualizar,
            ...valoresAActualizar
        }
        registroActualizar.id = recordExist.id;
        return this.photoRepository.save(registroActualizar);
    }
    async crearUsuarioPrueba() {
        const nuevaCasa = this.photoRepository.create();
        nuevaCasa.nombre = 'Casa de Prueba';
        nuevaCasa.valor = 1000;
        nuevaCasa.imagenURL = 'https://example.com/casa.jpg';
        nuevaCasa.username = 'admin';
        nuevaCasa.password = '1234';
        return this.photoRepository.save(nuevaCasa);
}

}
