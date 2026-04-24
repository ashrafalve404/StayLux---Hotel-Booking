import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from './room.entity';
import { Package } from '../../packages/entities/package.entity';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerNight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column('simple-array', { nullable: true, default: '' })
  images: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  amenities: string;

  @Column({ type: 'text', nullable: true })
  policies: string;

  @ManyToOne(() => User, (user) => user['hotels'], { nullable: false })
  owner: User;

  @Column()
  ownerId: number;

  @OneToMany(() => Room, (room) => room['hotel'])
  rooms: Room[];

  @OneToMany(() => Package, (pkg) => pkg['hotel'])
  packages: Package[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
