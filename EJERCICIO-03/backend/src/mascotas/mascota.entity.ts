import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mascotas')
export class Mascota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  raza: string;

  @Column({ type: 'int' })
  edad: number;

  @Column()
  nivelEnergia: string;
}
