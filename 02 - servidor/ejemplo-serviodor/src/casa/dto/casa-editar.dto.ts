import { IsOptional, IsUrl, Length, Min } from "class-validator";
import { CrearEditarBaseDto } from "./crear-editar.base.dto";

export class CasaEditarDto extends CrearEditarBaseDto {
    @IsOptional()
    declare nombre: string;

    @IsOptional()
    declare valor: number;

    @IsOptional()
    declare imagenUrl: string;
}