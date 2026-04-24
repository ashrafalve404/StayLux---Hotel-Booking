import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  duration: number;

  @Column('simple-array', { nullable: true })
  inclusions: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, default: '' })
  image: string;

  @ManyToOne(() => Hotel, (hotel) => hotel['packages'])
  hotel: Hotel;

  @Column()
  hotelId: number;

  @OneToMany(() => Booking, (booking) => booking['package'])
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

