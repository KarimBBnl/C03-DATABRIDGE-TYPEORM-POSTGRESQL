import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { Restaurante } from './restaurante.entity';
import { RestaurantesService } from './restaurantes.service';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @Get()
  findAll(): Promise<Restaurante[]> {
    return this.restaurantesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateRestauranteDto): Promise<Restaurante> {
    return this.restaurantesService.create(dto);
  }
}
