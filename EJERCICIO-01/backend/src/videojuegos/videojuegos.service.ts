import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Videojuego } from './videojuego.entity';

@Injectable()
export class VideojuegosService implements OnModuleInit {
  constructor(
    @InjectRepository(Videojuego)
    private readonly videojuegosRepository: Repository<Videojuego>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.videojuegosRepository.count()) > 0) {
      return;
    }

    await this.videojuegosRepository.save([
      {
        titulo: 'Hollow Knight',
        genero: 'Metroidvania',
        plataforma: 'Nintendo Switch',
        puntuacion: 9.4,
      },
      {
        titulo: 'Zelda: Tears of the Kingdom',
        genero: 'Aventura',
        plataforma: 'Nintendo Switch',
        puntuacion: 9.8,
      },
      {
        titulo: 'Forza Horizon 5',
        genero: 'Conducción',
        plataforma: 'Xbox',
        puntuacion: 9.1,
      },
    ]);
  }

  findAll(): Promise<Videojuego[]> {
    return this.videojuegosRepository.find();
  }
}
