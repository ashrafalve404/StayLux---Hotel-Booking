import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  role: 'user' | 'owner' | 'admin';

  @Column({ default: '' })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Hotel, (hotel) => hotel['owner'])
  hotels: Hotel[];

  @OneToMany(() => Booking, (booking) => booking['user'])
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

