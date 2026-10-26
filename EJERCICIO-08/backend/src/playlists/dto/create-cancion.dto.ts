import { IsString, MinLength } from 'class-validator';

export class CreateCancionDto {
  @IsString()
  @MinLength(1)
  titulo: string;

  @IsString()
  @MinLength(1)
  artista: string;
}
