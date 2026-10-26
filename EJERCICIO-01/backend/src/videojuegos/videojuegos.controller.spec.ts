import { Test, TestingModule } from '@nestjs/testing';
import { VideojuegosController } from './videojuegos.controller';
import { VideojuegosService } from './videojuegos.service';

describe('VideojuegosController', () => {
  let controller: VideojuegosController;
  const videojuegosService = { findAll: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideojuegosController],
      providers: [{ provide: VideojuegosService, useValue: videojuegosService }],
    }).compile();

    controller = module.get<VideojuegosController>(VideojuegosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns the collection from the service', async () => {
    const videojuegos = [{ id: 1, titulo: 'Hollow Knight' }];
    videojuegosService.findAll.mockResolvedValue(videojuegos);

    await expect(controller.findAll()).resolves.toBe(videojuegos);
  });
});
