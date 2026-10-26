import { Controller, Get, Param, ParseIntPipe, Patch, Body } from '@nestjs/common';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { Viaje } from './viaje.entity';
import { ViajesService } from './viajes.service';

@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Get()
  findAll(): Promise<Viaje[]> {
    return this.viajesService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateViajeDto,
  ): Promise<Viaje> {
    return this.viajesService.update(id, dto);
  }
}
