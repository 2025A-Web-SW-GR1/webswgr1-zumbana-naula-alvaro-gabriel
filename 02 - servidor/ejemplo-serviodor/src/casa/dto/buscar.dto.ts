import { IsOptional, Length } from "class-validator";

export class BuscarDto{
    @Length(3, 500)
    @IsOptional()
    nombre: string;
}