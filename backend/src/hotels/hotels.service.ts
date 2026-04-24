import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelDto } from './dtos/create-hotel.dto';
import { Room } from './entities/room.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Package } from '../packages/entities/package.entity';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private hotelsRepository: Repository<Hotel>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const hotel = this.hotelsRepository.create({
      ...createHotelDto,
      rating: createHotelDto.rating || 4.5,
      reviewCount: createHotelDto.reviewCount || 0,
      images: createHotelDto.images || [],
      isActive: true,
    });
    return this.hotelsRepository.save(hotel);
  }

  async findAll(): Promise<Hotel[]> {
    return this.hotelsRepository.find({
      relations: ['owner'],
    });
  }

  async findByOwner(ownerId: number): Promise<Hotel[]> {
    return this.hotelsRepository.find({
      where: { ownerId },
      relations: ['owner'],
    });
  }

  async findOne(id: number): Promise<Hotel> {
    const hotel = await this.hotelsRepository.findOne({
      where: { id },
      relations: ['owner', 'rooms'],
    });
    if (!hotel) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }
    return hotel;
  }

  async update(id: number, updateData: Partial<CreateHotelDto>): Promise<Hotel> {
    await this.hotelsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const bookings = await this.hotelsRepository.manager.find(Booking, {
      where: { hotelId: id },
    });
    if (bookings.length > 0) {
      throw new BadRequestException('Cannot delete hotel with existing bookings');
    }
    // Delete rooms first
    await this.roomsRepository.delete({ hotelId: id });
    // Delete packages
    await this.hotelsRepository.manager.delete(Package, { hotelId: id });
    const result = await this.hotelsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }
  }

  async createRoom(hotelId: number, roomData: any): Promise<any> {
    const room = this.roomsRepository.create({
      ...roomData,
      hotelId,
    });
    return this.roomsRepository.save(room);
  }

  async getRooms(hotelId: number): Promise<any[]> {
    return this.roomsRepository.find({
      where: { hotelId },
    });
  }

  async updateRoom(roomId: number, updateData: any): Promise<any> {
    await this.roomsRepository.update(roomId, updateData);
    const room = await this.roomsRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }
    return room;
  }

  async deleteRoom(roomId: number): Promise<void> {
    await this.roomsRepository.delete(roomId);
  }
}
