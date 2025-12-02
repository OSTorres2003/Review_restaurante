import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn({ name: 'restaurant_id' })
  restaurantId: number;

  @ManyToOne(() => User, (user) => user.ownedRestaurants, {
    nullable: false,
  })
  owner: User;

  @Column({ name: 'owner_user_id' })
  ownerUserId: number;

  @Column({ name: 'name', type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 50, nullable: true })
  phoneNumber?: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ name: 'city', type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ name: 'zone', type: 'varchar', length: 50, nullable: true })
  zone?: string;

  @Column({ name: 'maps_url', type: 'varchar', length: 500, nullable: true })
  mapsUrl?: string;

  @Column({ name: 'price_range', type: 'smallint', nullable: true })
  priceRange?: number;

  @Column({ name: 'avg_rating', type: 'numeric', precision: 2, scale: 1, default: 0.0 })
  avgRating: string;

  @Column({ name: 'total_reviews', type: 'int', default: 0 })
  totalReviews: number;

  @Column({ name: 'is_approved', type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ name: 'is_premium', type: 'boolean', default: false })
  isPremium: boolean;

  @Column({ name: 'onboarding_status', type: 'varchar', length: 20, default: 'Pendiente' })
  onboardingStatus: string;

  @Column({ name: 'onboarding_comment', type: 'text', nullable: true })
  onboardingComment?: string;
}
