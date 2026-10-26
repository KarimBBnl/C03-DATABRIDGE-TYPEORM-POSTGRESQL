import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Videojuego } from './videojuego.entity';
import { VideojuegosService } from './videojuegos.service';

describe('VideojuegosService', () => {
  let service: VideojuegosService;
  let repository: jest.Mocked<Pick<Repository<Videojuego>, 'find' | 'count' | 'save'>>;

  beforeEach(async () => {
    repository = {
      find: jest.fn(),
      count: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideojuegosService,
        {
          provide: getRepositoryToken(Videojuego),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<VideojuegosService>(VideojuegosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns persisted videojuegos', async () => {
    const videojuegos = [{ id: 1, titulo: 'Hollow Knight' } as Videojuego];
    repository.find.mockResolvedValue(videojuegos);

    await expect(service.findAll()).resolves.toBe(videojuegos);
    expect(repository.find).toHaveBeenCalled();
  });
});
