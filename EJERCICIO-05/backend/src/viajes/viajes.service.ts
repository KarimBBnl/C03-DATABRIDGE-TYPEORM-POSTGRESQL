import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { Viaje } from './viaje.entity';

@Injectable()
export class ViajesService implements OnModuleInit {
  constructor(
    @InjectRepository(Viaje)
    private readonly viajesRepository: Repository<Viaje>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.viajesRepository.count()) > 0) {
      return;
    }

    await this.viajesRepository.save([
      {
        destino: 'Tokio',
        pais: 'Japón',
        estado: 'RESERVADO',
        fecha: '2026-11-12',
      },
      {
        destino: 'Lisboa',
        pais: 'Portugal',
        estado: 'PLANIFICADO',
        fecha: '2027-03-18',
      },
      {
        destino: 'Reikiavik',
        pais: 'Islandia',
        estado: 'RESERVADO',
        fecha: '2027-07-09',
      },
    ]);
  }

  findAll(): Promise<Viaje[]> {
    return this.viajesRepository.find({ order: { fecha: 'ASC' } });
  }

  async update(id: number, dto: UpdateViajeDto): Promise<Viaje> {
    const viaje = await this.viajesRepository.findOneBy({ id });
    if (!viaje) {
      throw new NotFoundException(`No existe un viaje con id ${id}`);
    }

    this.viajesRepository.merge(viaje, dto);
    return this.viajesRepository.save(viaje);
  }
}
