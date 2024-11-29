import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File, Transactions } from './transactions/entities';

@Module({
  imports: [
    TransactionsModule,
    TypeOrmModule.forRoot({
      entities: [File, Transactions],
      host: 'mysqlDB',
      username: 'root',
      password: 'root',
      database: 'mysqlDB',
      retryAttempts: 10,
      retryDelay: 5000,
      type: 'mysql',
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
