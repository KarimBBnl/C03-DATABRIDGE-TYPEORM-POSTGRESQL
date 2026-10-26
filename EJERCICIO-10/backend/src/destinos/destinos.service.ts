import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';
import { Destino, Prioridad } from './destino.entity';

@Injectable()
export class DestinosService implements OnModuleInit {
  constructor(
    @InjectRepository(Destino)
    private readonly destinosRepository: Repository<Destino>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.destinosRepository.count()) > 0) {
      return;
    }

    await this.destinosRepository.save([
      {
        nombre: 'Reikiavik',
        pais: 'Islandia',
        prioridad: Prioridad.ALTA,
        visitado: false,
      },
      {
        nombre: 'Tokio',
        pais: 'Japón',
        prioridad: Prioridad.MEDIA,
        visitado: false,
      },
      {
        nombre: 'Lisboa',
        pais: 'Portugal',
        prioridad: Prioridad.BAJA,
        visitado: true,
      },
    ]);
  }

  findAll(): Promise<Destino[]> {
    return this.destinosRepository.find({
      order: { prioridad: 'ASC', visitado: 'ASC', nombre: 'ASC' },
    });
  }

  create(dto: CreateDestinoDto): Promise<Destino> {
    return this.destinosRepository.save(this.destinosRepository.create(dto));
  }

  async update(id: number, dto: UpdateDestinoDto): Promise<Destino> {
    const destino = await this.destinosRepository.findOneBy({ id });
    if (!destino) {
      throw new NotFoundException(`No existe un destino con id ${id}`);
    }

    this.destinosRepository.merge(destino, dto);
    return this.destinosRepository.save(destino);
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.destinosRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`No existe un destino con id ${id}`);
    }
  }
}
