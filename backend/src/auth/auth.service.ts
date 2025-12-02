import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '../users/user.entity';
import { Restaurant } from '../restaurante/restaurant.entity';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginDto } from './dtos/login.dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Restaurant)
    private readonly restaurantsRepo: Repository<Restaurant>,
    private readonly jwtService: JwtService,
  ) {}

  // ============= REGISTRO USUARIOS (APP) =============
  async registerUser(dto: RegisterUserDto) {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      bio: dto.bio,
      location: dto.location,
      registrationMethod: 'email',
      isActive: true,
    });

    const saved = await this.usersRepo.save(user);
    return this.buildAuthResponse(saved, 'USER');
  }

  // ============= LOGIN USUARIOS (APP) =============
  async loginUser(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.buildAuthResponse(user, 'USER');
  }

  // ============= LOGIN RESTAURANTES (DASHBOARD) =============
  async loginRestaurant(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar que el usuario sea dueño de al menos un restaurante
    const restaurant = await this.restaurantsRepo.findOne({
      where: { ownerUserId: user.userId },
    });

    if (!restaurant) {
      throw new UnauthorizedException(
        'Este usuario no tiene un restaurante asociado',
      );
    }

    // Opcional: solo permitir si está aprobado
    if (!restaurant.isApproved) {
      throw new UnauthorizedException(
        'El restaurante aún no está aprobado por la plataforma',
      );
    }

    return this.buildAuthResponse(
      user,
      'RESTAURANT_OWNER',
      restaurant.restaurantId,
    );
  }

  // ============= CONSTRUCCIÓN DEL TOKEN =============
  private buildAuthResponse(
    user: User,
    role: 'USER' | 'RESTAURANT_OWNER',
    restaurantId?: number,
  ) {
    const payload: any = {
      sub: user.userId,
      email: user.email,
      role,
    };

    if (restaurantId) {
      payload.restaurantId = restaurantId;
    }

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.userId,
        email: user.email,
        fullName: user.fullName,
        role,
        restaurantId: restaurantId ?? null,
      },
    };
  }
}
