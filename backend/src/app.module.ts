import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Cargar variables de entorno desde .env
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env', // opcional, por defecto ya usa .env en la raíz
    }),

    // Conexión a PostgreSQL (Supabase)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST as string,
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,

      autoLoadEntities: true,
      synchronize: true, // SOLO en desarrollo

      // Necesario para Supabase (equivalente a "Require" en DataGrip)
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
