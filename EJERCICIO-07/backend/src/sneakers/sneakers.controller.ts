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
  Post,
} from '@nestjs/common';
import { CreateSneakerDto } from './dto/create-sneaker.dto';
import { UpdateSneakerDto } from './dto/update-sneaker.dto';
import { Sneaker } from './sneaker.entity';
import { SneakersService } from './sneakers.service';

@Controller('sneakers')
export class SneakersController {
  constructor(private readonly sneakersService: SneakersService) {}

  @Get()
  findAll(): Promise<Sneaker[]> {
    return this.sneakersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateSneakerDto): Promise<Sneaker> {
    return this.sneakersService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSneakerDto,
  ): Promise<Sneaker> {
    return this.sneakersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.sneakersService.remove(id);
  }
}
