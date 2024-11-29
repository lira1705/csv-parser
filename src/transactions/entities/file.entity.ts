import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transactions } from './transactions.entity';

@Entity('file')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column('longblob')
  data: Buffer;

  @OneToMany(() => Transactions, (transaction) => transaction.file)
  transactions: Transactions[];
}
