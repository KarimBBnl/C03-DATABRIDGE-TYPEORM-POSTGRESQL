import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sneakers')
export class Sneaker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modelo: string;

  @Column()
  marca: string;

  @Column({ type: 'int', default: 0 })
  stock: number;
}
