import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('peliculas')
export class Pelicula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  genero: string;

  @Column({ type: 'int' })
  anio: number;

  @Column({ type: 'real' })
  puntuacion: number;

  @Column({ type: 'boolean', default: false })
  favorita: boolean;
}
