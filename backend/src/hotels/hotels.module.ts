import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Room } from './entities/room.entity';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, Room])],
  providers: [HotelsService],
  controllers: [HotelsController],
})
export class HotelsModule {}
