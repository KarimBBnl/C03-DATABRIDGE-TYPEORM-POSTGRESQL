import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './mascota.entity';

@Injectable()
export class MascotasService implements OnModuleInit {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotasRepository: Repository<Mascota>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.mascotasRepository.count()) > 0) {
      return;
    }

    await this.mascotasRepository.save([
      {
        nombre: 'Nala',
        raza: 'Golden Retriever',
        edad: 4,
        nivelEnergia: 'Alto',
      },
      {
        nombre: 'Milo',
        raza: 'Beagle',
        edad: 6,
        nivelEnergia: 'Medio',
      },
      {
        nombre: 'Kira',
        raza: 'Border Collie',
        edad: 2,
        nivelEnergia: 'Muy alto',
      },
    ]);
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotasRepository.findOneBy({ id });
    if (!mascota) {
      throw new NotFoundException(`No existe una mascota con id ${id}`);
    }
    return mascota;
  }
}
