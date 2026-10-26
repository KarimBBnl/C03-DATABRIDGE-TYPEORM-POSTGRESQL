import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurantes')
export class Restaurante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  tipoCocina: string;

  @Column()
  ciudad: string;

  @Column({ type: 'real' })
  precioMedio: number;
}
