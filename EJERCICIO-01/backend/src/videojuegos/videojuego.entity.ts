import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('videojuegos')
export class Videojuego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  genero: string;

  @Column()
  plataforma: string;

  @Column({ type: 'real' })
  puntuacion: number;
}
