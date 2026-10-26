import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { Libro } from './libro.entity';

@Injectable()
export class LibrosService implements OnModuleInit {
  constructor(
    @InjectRepository(Libro)
    private readonly librosRepository: Repository<Libro>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.librosRepository.count()) > 0) {
      return;
    }

    await this.librosRepository.save([
      { titulo: '1984', autor: 'George Orwell', leido: false },
      { titulo: 'El Hobbit', autor: 'J. R. R. Tolkien', leido: false },
      { titulo: 'Fahrenheit 451', autor: 'Ray Bradbury', leido: true },
    ]);
  }

  findAll(): Promise<Libro[]> {
    return this.librosRepository.find({ order: { id: 'ASC' } });
  }

  async markAsRead(id: number, dto: UpdateLibroDto): Promise<Libro> {
    const libro = await this.librosRepository.findOneBy({ id });
    if (!libro) {
      throw new NotFoundException(`No existe un libro con id ${id}`);
    }

    this.librosRepository.merge(libro, dto);
    return this.librosRepository.save(libro);
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.librosRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`No existe un libro con id ${id}`);
    }
  }
}
