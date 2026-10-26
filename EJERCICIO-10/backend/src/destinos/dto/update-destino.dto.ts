import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Prioridad } from '../destino.entity';

export class UpdateDestinoDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  pais?: string;

  @IsOptional()
  @IsEnum(Prioridad)
  prioridad?: Prioridad;

  @IsOptional()
  @IsBoolean()
  visitado?: boolean;
}
