import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';
import { Destino } from './destino.entity';
import { DestinosService } from './destinos.service';

@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Get()
  findAll(): Promise<Destino[]> {
    return this.destinosService.findAll();
  }

  @Post()
  create(@Body() dto: CreateDestinoDto): Promise<Destino> {
    return this.destinosService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDestinoDto,
  ): Promise<Destino> {
    return this.destinosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.destinosService.remove(id);
  }
}
