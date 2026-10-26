import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCancionDto } from './dto/create-cancion.dto';
import { Cancion } from './cancion.entity';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistsService implements OnModuleInit {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistsRepository: Repository<Playlist>,
    @InjectRepository(Cancion)
    private readonly cancionesRepository: Repository<Cancion>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.playlistsRepository.count()) > 0) {
      return;
    }

    const entrenamiento = await this.playlistsRepository.save({
      nombre: 'Entrenamiento',
    });
    const relajacion = await this.playlistsRepository.save({
      nombre: 'Relajación',
    });
    await this.cancionesRepository.save([
      { titulo: 'Eye of the Tiger', artista: 'Survivor', playlist: entrenamiento },
      { titulo: 'Stronger', artista: 'Kanye West', playlist: entrenamiento },
      { titulo: 'Weightless', artista: 'Marconi Union', playlist: relajacion },
    ]);
  }

  findAll(): Promise<Playlist[]> {
    return this.playlistsRepository.find({
      relations: { canciones: true },
      order: { id: 'ASC', canciones: { id: 'ASC' } },
    });
  }

  async findOne(id: number): Promise<Playlist> {
    const playlist = await this.playlistsRepository.findOne({
      where: { id },
      relations: { canciones: true },
      order: { canciones: { id: 'ASC' } },
    });
    if (!playlist) {
      throw new NotFoundException(`No existe una playlist con id ${id}`);
    }
    return playlist;
  }

  async addSong(id: number, dto: CreateCancionDto): Promise<Cancion> {
    const playlist = await this.playlistsRepository.findOneBy({ id });
    if (!playlist) {
      throw new NotFoundException(`No existe una playlist con id ${id}`);
    }

    const cancion = this.cancionesRepository.create({ ...dto, playlist });
    return this.cancionesRepository.save(cancion);
  }
}
