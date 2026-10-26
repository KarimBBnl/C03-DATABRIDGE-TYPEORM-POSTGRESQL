import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { Restaurante } from './restaurante.entity';

@Injectable()
export class RestaurantesService implements OnModuleInit {
  constructor(
    @InjectRepository(Restaurante)
    private readonly restaurantesRepository: Repository<Restaurante>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.restaurantesRepository.count()) > 0) {
      return;
    }

    await this.restaurantesRepository.save([
      {
        nombre: 'La Trattoria',
        tipoCocina: 'Italiano',
        ciudad: 'Zaragoza',
        precioMedio: 22,
      },
      {
        nombre: 'Sakura',
        tipoCocina: 'Japonés',
        ciudad: 'Zaragoza',
        precioMedio: 28,
      },
      {
        nombre: 'El Mercado',
        tipoCocina: 'Tradicional',
        ciudad: 'Huesca',
        precioMedio: 18,
      },
    ]);
  }

  findAll(): Promise<Restaurante[]> {
    return this.restaurantesRepository.find({ order: { id: 'DESC' } });
  }

  create(dto: CreateRestauranteDto): Promise<Restaurante> {
    const restaurante = this.restaurantesRepository.create(dto);
    return this.restaurantesRepository.save(restaurante);
  }
}
