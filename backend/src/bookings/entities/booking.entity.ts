import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Package } from '../../packages/entities/package.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @Column()
  guests: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  @Column({ type: 'text', nullable: true })
  specialRequests: string;

  @Column({ nullable: true })
  packageId: number;

  @ManyToOne(() => Package, (pkg) => pkg['bookings'], { nullable: true })
  package: Package;

  @ManyToOne(() => Hotel, (hotel) => hotel['bookings'], { nullable: false })
  hotel: Hotel;

  @Column()
  hotelId: number;

  @ManyToOne(() => User, (user) => user['bookings'])
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


