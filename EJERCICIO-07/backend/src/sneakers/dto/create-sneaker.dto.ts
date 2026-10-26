import { Type } from 'class-transformer';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateSneakerDto {
  @IsString()
  @MinLength(1)
  modelo: string;

  @IsString()
  @MinLength(1)
  marca: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;
}
