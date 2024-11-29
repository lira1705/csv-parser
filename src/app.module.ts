import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File, Transactions } from './transactions/entities';
import { FileManageModule } from './fileManage/fileManage.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TransactionsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        entities: [File, Transactions],
        host: configService.get<string>('DATABASE_HOST') || 'mysqlDB',
        username: configService.get<string>('DATABASE_USER') || 'root',
        password: configService.get<string>('DATABASE_PASS') || 'root',
        database: configService.get<string>('DATABASE_NAME') || 'mysqlDB',
        retryAttempts: 10,
        retryDelay: 5000,
        type: 'mysql',
        synchronize: true,
      }),
    }),
    FileManageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
