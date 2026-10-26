import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLibroDto {
  @IsOptional()
  @IsBoolean()
  leido?: boolean;
}
