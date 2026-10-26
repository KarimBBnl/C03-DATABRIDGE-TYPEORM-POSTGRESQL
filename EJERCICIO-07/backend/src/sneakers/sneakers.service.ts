import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSneakerDto } from './dto/create-sneaker.dto';
import { UpdateSneakerDto } from './dto/update-sneaker.dto';
import { Sneaker } from './sneaker.entity';

@Injectable()
export class SneakersService implements OnModuleInit {
  constructor(
    @InjectRepository(Sneaker)
    private readonly sneakersRepository: Repository<Sneaker>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.sneakersRepository.count()) > 0) {
      return;
    }

    await this.sneakersRepository.save([
      { modelo: 'Air Max 1', marca: 'Nike', stock: 4 },
      { modelo: 'Gazelle', marca: 'Adidas', stock: 2 },
      { modelo: 'Chuck Taylor', marca: 'Converse', stock: 0 },
    ]);
  }

  findAll(): Promise<Sneaker[]> {
    return this.sneakersRepository.find({ order: { id: 'ASC' } });
  }

  create(dto: CreateSneakerDto): Promise<Sneaker> {
    return this.sneakersRepository.save(this.sneakersRepository.create(dto));
  }

  async update(id: number, dto: UpdateSneakerDto): Promise<Sneaker> {
    const sneaker = await this.sneakersRepository.findOneBy({ id });
    if (!sneaker) {
      throw new NotFoundException(`No existe un sneaker con id ${id}`);
    }

    this.sneakersRepository.merge(sneaker, dto);
    return this.sneakersRepository.save(sneaker);
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.sneakersRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`No existe un sneaker con id ${id}`);
    }
  }
}
