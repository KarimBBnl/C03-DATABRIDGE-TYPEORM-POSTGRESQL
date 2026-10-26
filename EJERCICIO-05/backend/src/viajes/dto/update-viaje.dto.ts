import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateViajeDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  estado?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;
}
