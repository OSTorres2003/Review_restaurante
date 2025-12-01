import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
@Module({
imports: [
    // --- Configuración de la Conexión a PostgreSQL ---
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',              // ⚠️ Tu servidor
      port: 5432,                     // ⚠️ Tu puerto
      username: 'nombre_de_usuario',  // ⚠️ Tu usuario de Postgres
      password: 'tu_contraseña_secreta', // ⚠️ Tu contraseña
      database: 'nombre_de_la_db',    // ⚠️ Nombre de la BD que creaste

      // Busca todas las entidades (.entity.ts) en el proyecto
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      
      logging: true, 
      synchronize: false, // Debe ser 'false' en producción
    }),
    
    // --- Módulos de la Aplicación ---
    UsersModule, 
    // Aquí irán RestaurantsModule, ReviewsModule, etc.
  ],











  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
