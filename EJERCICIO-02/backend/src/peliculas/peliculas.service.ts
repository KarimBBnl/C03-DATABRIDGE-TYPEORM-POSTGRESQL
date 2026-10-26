import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './pelicula.entity';

@Injectable()
export class PeliculasService implements OnModuleInit {
  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculasRepository: Repository<Pelicula>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.peliculasRepository.count()) > 0) {
      return;
    }

    await this.peliculasRepository.save([
      {
        titulo: 'Interstellar',
        genero: 'Ciencia ficción',
        anio: 2014,
        puntuacion: 8.7,
        favorita: true,
      },
      {
        titulo: 'Origen',
        genero: 'Ciencia ficción',
        anio: 2010,
        puntuacion: 8.8,
        favorita: false,
      },
      {
        titulo: 'El viaje de Chihiro',
        genero: 'Animación',
        anio: 2001,
        puntuacion: 8.6,
        favorita: true,
      },
    ]);
  }

  findAll(): Promise<Pelicula[]> {
    return this.peliculasRepository.find({
      order: { puntuacion: 'DESC' },
    });
  }
}
