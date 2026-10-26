import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Evento } from './evento.entity';

@Injectable()
export class EventosService implements OnModuleInit {
  constructor(
    @InjectRepository(Evento)
    private readonly eventosRepository: Repository<Evento>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.eventosRepository.count()) > 0) {
      return;
    }

    await this.eventosRepository.save([
      { nombre: 'Tech Meetup', ciudad: 'Zaragoza', categoria: 'Tecnología' },
      { nombre: 'Noche de Jazz', ciudad: 'Zaragoza', categoria: 'Música' },
      { nombre: 'DevFest', ciudad: 'Madrid', categoria: 'Tecnología' },
    ]);
  }

  findAll(ciudad?: string, categoria?: string): Promise<Evento[]> {
    const where: FindOptionsWhere<Evento> = {};
    if (ciudad?.trim()) {
      where.ciudad = ciudad.trim();
    }
    if (categoria?.trim()) {
      where.categoria = categoria.trim();
    }

    return this.eventosRepository.find({ where, order: { nombre: 'ASC' } });
  }
}
