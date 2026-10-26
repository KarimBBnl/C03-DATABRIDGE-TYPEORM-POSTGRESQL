import { IsEnum, IsString, MinLength } from 'class-validator';
import { Prioridad } from '../destino.entity';

export class CreateDestinoDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  @MinLength(1)
  pais: string;

  @IsEnum(Prioridad)
  prioridad: Prioridad;
}
