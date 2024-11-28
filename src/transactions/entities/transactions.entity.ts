import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableForeignKey,
} from 'typeorm';
import { File } from './file.entity';

@Entity('transactions')
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column()
  from: string;

  @Column()
  amount: number;

  @Column()
  status: string;

  @ManyToOne((type) => File, (transaction) => transaction.id) file: File;
}
