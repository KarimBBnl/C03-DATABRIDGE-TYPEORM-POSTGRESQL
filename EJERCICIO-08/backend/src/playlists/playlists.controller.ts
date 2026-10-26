import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateCancionDto } from './dto/create-cancion.dto';
import { Cancion } from './cancion.entity';
import { Playlist } from './playlist.entity';
import { PlaylistsService } from './playlists.service';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  findAll(): Promise<Playlist[]> {
    return this.playlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Playlist> {
    return this.playlistsService.findOne(id);
  }

  @Post(':id/canciones')
  addSong(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCancionDto,
  ): Promise<Cancion> {
    return this.playlistsService.addSong(id, dto);
  }
}
