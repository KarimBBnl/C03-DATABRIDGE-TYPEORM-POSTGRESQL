import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { Libro } from './libro.entity';
import { LibrosService } from './libros.service';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  findAll(): Promise<Libro[]> {
    return this.librosService.findAll();
  }

  @Patch(':id')
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLibroDto,
  ): Promise<Libro> {
    return this.librosService.markAsRead(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.librosService.remove(id);
  }
}
