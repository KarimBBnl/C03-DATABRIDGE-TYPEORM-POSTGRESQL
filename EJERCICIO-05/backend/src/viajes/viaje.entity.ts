import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('viajes')
export class Viaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  destino: string;

  @Column()
  pais: string;

  @Column()
  estado: string;

  @Column({ type: 'date' })
  fecha: string;
}
